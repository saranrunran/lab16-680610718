import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { useEnrollmentStore } from "@/lib/enrollment-store";


type Option = { value: string; label: string };

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full min-w-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminCoursesPage() {
  const { courses, addCourse, removeInstruc, removeCourse } = useEnrollmentStore();

  const [formCourseCode, setFormCourseCode] = useState("");
  const [formCourseTitle, setFormCourseTitle] = useState("");
  const [formInstruc, setFormInstruc] = useState<string[]>([]);
  const [instrucInput, setInstrucInput] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAdd = () => {
    if (!formCourseCode || !formCourseTitle || !formInstruc) return;
    addCourse({
            courseCode: formCourseCode.trim().toUpperCase(),
            courseTitle: formCourseTitle.trim(),
            instructors: formInstruc
        });

    setFormCourseCode("");
    setFormCourseTitle("");
    setFormInstruc([]);
    
    setAddDialogOpen(false);
  };

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleAddDialogOpenChange = (open: boolean) => {
    setAddDialogOpen(open);
    if (!open) {
        setFormCourseCode("");
        setFormCourseTitle("");
        setFormInstruc([]);
    }
  };

  const anchor = useComboboxAnchor();

  const instructors = Array.from(
    new Set(courses.flatMap((c)=> c.instructors)),
  );

  const isDuplicated = courses.some((c)=>
    c.courseCode === formCourseCode?.trim().toUpperCase(),
  )



  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
            <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
            <p className="text-sm text-muted-foreground">
            {courses.length} วิชา —  เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
            </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={handleAddDialogOpenChange}>
            <DialogTrigger render={<Button />}>
            <PlusCircle className="h-4 w-4" />
            เพิ่มวิชา
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
                <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 min-w-0">
                <div className="grid gap-1.5">
                    <Label htmlFor="formCourse">รหัสวิชา</Label>
                    <Input
                        className="bg-background"
                        id="courseId"
                        onChange={(e) => setFormCourseCode(e.target.value)}
                        placeholder="เช่น CPE303"
                        aria-invalid={isDuplicated}
                        value={formCourseCode}
                    />
                    {isDuplicated && (
                    <p className="text-xs font-medium text-red-400 dark:text-red-400 mt-1">
                        มีรหัสวิชา {formCourseCode.trim().toUpperCase()} นี้แล้ว
                    </p>
                    )}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="formStudent">ชื่อวิชา</Label>
                    <Input
                        className="bg-background"
                        id="courseTitle"
                        onChange={(e) => setFormCourseTitle(e.target.value)}
                        placeholder="เช่น Data Structure"
                        value={formCourseTitle}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="formInstruc" className="">ผู้สอน</Label>
                    <Combobox
                        multiple
                        autoHighlight
                        items={instructors}
                        onValueChange={(v) => setFormInstruc(v as string[])}
                        value={formInstruc || []}
                        >
                        <ComboboxChips ref={anchor}>
                            <ComboboxValue>
                            {(values) => (
                                <React.Fragment>
                                {values?.map((name: string) => (
                                    <ComboboxChip key={name}>
                                    {name}
                                    </ComboboxChip>
                                ))}
                                <ComboboxChipsInput
                                    value={instrucInput}
                                    onChange={(e)=> setInstrucInput(e.target.value)}
                                />
                                </React.Fragment>
                            )}
                            </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                            <ComboboxEmpty className="text-left justify-start w-full">
                                {instrucInput.trim() ? (
                                <div
                                    className="w-full relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                                    onClick={() => {
                                    const newName = instrucInput.trim();
                                    if (!formInstruc.includes(newName)) {
                                        setFormInstruc([...formInstruc, newName]);
                                    }
                                    setInstrucInput("");
                                    }}
                                >
                                    + เพิ่มผู้สอน  <p>"{instrucInput.trim()}"</p>
                                </div>
                                ) : ("Not found")}
                            </ComboboxEmpty>
                            <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item} value={item}>
                                {item}
                                </ComboboxItem>
                            )}
                            </ComboboxList>
                        </ComboboxContent>
                        </Combobox>
                </div>
            </div>
            <DialogFooter>
                <Button disabled={!formCourseCode || !formCourseTitle || !formInstruc || isDuplicated} onClick={handleAdd}>
                    บันทึก
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
                <TableRow key={`${c.courseCode}`}>
                    <TableCell>{c.courseCode}</TableCell>
                    <TableCell>{c.courseTitle}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {c.instructors && c.instructors.length > 0 ? (
                                c.instructors.map((i) => (
                                    <Badge key={i} variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    {i}
                                    <button
                                        type="button"
                                        
                                        onClick={() => {
                                            console.log("ลบอาจารย์", i, "จากวิชา", c.courseCode);
                                            removeInstruc?.(i, c.courseCode)}}
                                        className="ml-0.5 rounded-full hover:opacity-70"
                                    >
                                        ×
                                    </button>
                                    </Badge>
                                ))
                                ) : ( <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                                console.log("ลบ", c.courseCode, "แล้ว")
                                removeCourse(c.courseCode)}}
                        >
                            <Trash2 className="text-destructive"></Trash2>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
