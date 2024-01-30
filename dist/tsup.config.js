"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"], // Build for commonJS and ESmodules
    dts: true, // Generate declaration file (.d.ts)
    splitting: false,
    sourcemap: true,
    clean: true,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHN1cC5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90c3VwLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFvQztBQUVwQyxrQkFBZSxJQUFBLG1CQUFZLEVBQUM7SUFDMUIsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQ3ZCLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxtQ0FBbUM7SUFDM0QsR0FBRyxFQUFFLElBQUksRUFBRSxvQ0FBb0M7SUFDL0MsU0FBUyxFQUFFLEtBQUs7SUFDaEIsU0FBUyxFQUFFLElBQUk7SUFDZixLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ0c3VwXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGVudHJ5OiBbXCJzcmMvaW5kZXgudHNcIl0sXHJcbiAgZm9ybWF0OiBbXCJjanNcIiwgXCJlc21cIl0sIC8vIEJ1aWxkIGZvciBjb21tb25KUyBhbmQgRVNtb2R1bGVzXHJcbiAgZHRzOiB0cnVlLCAvLyBHZW5lcmF0ZSBkZWNsYXJhdGlvbiBmaWxlICguZC50cylcclxuICBzcGxpdHRpbmc6IGZhbHNlLFxyXG4gIHNvdXJjZW1hcDogdHJ1ZSxcclxuICBjbGVhbjogdHJ1ZSxcclxufSk7Il19