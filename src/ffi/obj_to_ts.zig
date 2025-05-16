const std = @import("std");

/// Parses a JSON string and generates a TypeScript interface as a C string.
///
/// - `value`: Null-terminated JSON string.
/// - `root`: Null-terminated root interface name.
///
/// Returns a null-terminated C string allocated with the C allocator. Caller must free.
export fn obj_2_ts(value: [*:0]const u8, root: [*:0]const u8) [*:0]u8 {
    const allocator = std.heap.c_allocator;
    const json_slice = std.mem.span(value);
    const root_slice = std.mem.span(root);

    var parsed = parseJson(allocator, json_slice) catch |err| {
        std.debug.print("Error parsing JSON: {}\n", .{err});
        return allocator.dupeZ(u8, "Error: Invalid JSON") catch unreachable;
    };
    defer parsed.deinit();

    const ts_type = generateTypescript(allocator, parsed.value, root_slice) catch |err| {
        std.debug.print("Error generating TypeScript: {}\n", .{err});
        return allocator.dupeZ(u8, "Error: Generation failed") catch unreachable;
    };
    defer allocator.free(ts_type);

    return allocator.dupeZ(u8, ts_type) catch unreachable;
}

/// Parses JSON string to a parsed std.json.Value.
pub fn parseJson(allocator: std.mem.Allocator, source: []const u8) !std.json.Parsed(std.json.Value) {
    return std.json.parseFromSlice(std.json.Value, allocator, source, .{});
}

/// Recursively generate TypeScript types from a Zig JSON Value.
pub fn generateTypescript(
    allocator: std.mem.Allocator,
    value: std.json.Value,
    root_name: []const u8,
) ![]u8 {
    var output = std.ArrayList(u8).init(allocator);
    try output.appendSlice("interface ");
    try output.appendSlice(root_name);
    try output.appendSlice(" ");
    try writeTypeScriptObject(allocator, &output, value, 0);
    return output.toOwnedSlice();
}

fn writeIndent(output: *std.ArrayList(u8), level: usize) !void {
    try output.appendNTimes(' ', level * 2);
}

fn writeTypeScriptObject(
    allocator: std.mem.Allocator,
    output: *std.ArrayList(u8),
    value: std.json.Value,
    indent: usize,
) !void {
    if (value != .object) return error.ExpectedObject;
    const object = value.object;
    // if (value.tag() != .object) return error.ExpectedObject;
    // const object = value.object.?;

    try output.appendSlice("{\n");

    var keys = object.iterator();
    while (keys.next()) |entry| {
        const key = entry.key_ptr.*;
        const val = entry.value_ptr.*;

        try writeIndent(output, indent + 1);
        try output.appendSlice(key);

        // Optional field if value is `null`
        if (val == .null) {
            try output.append('?');
        }

        try output.appendSlice(": ");
        try writeTypeScriptType(allocator, output, val, indent + 1);
        try output.appendSlice(";\n");
    }

    try writeIndent(output, indent);
    try output.append('}');
}

fn writeTypeScriptType(
    allocator: std.mem.Allocator,
    output: *std.ArrayList(u8),
    value: std.json.Value,
    indent: usize,
) anyerror!void {
    switch (value) {
        .null => try output.appendSlice("null"),
        .bool => try output.appendSlice("boolean"),
        .integer, .float => try output.appendSlice("number"),
        .string => try output.appendSlice("string"),
        .object => try writeTypeScriptObject(allocator, output, value, indent),
        .array => {
            const array = value.array;

            if (array.items.len == 0) {
                try output.appendSlice("any[]");
                return;
            }

            // Union type set
            var type_set = std.StringHashMap(void).init(allocator);
            defer type_set.deinit();

            var temp = std.ArrayList(u8).init(allocator);
            defer temp.deinit();

            for (array.items) |item| {
                temp.clearRetainingCapacity();
                try writeTypeScriptType(allocator, &temp, item, indent);
                const t = try allocator.dupe(u8, temp.items);
                _ = try type_set.put(t, {});
            }

            var iter = type_set.keyIterator();
            var count: usize = 0;
            while (iter.next()) |typ| {
                if (count > 0) try output.appendSlice(" | ");
                try output.appendSlice(typ.*);
                count += 1;
            }

            try output.appendSlice("[]");
        },

        else => return error.UnexpectedError,
    }
}
