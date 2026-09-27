import type { Student } from "@/lib/types";

export function Footer({firstName,lastName,studentId}:Student) {
    return (
        <footer className="border-t p-4 text-center text-xs text-muted-foreground">
            <p>จัดทำโดย {firstName} {lastName} — รหัสนักศึกษา {studentId}</p>
        </footer>
    );
}