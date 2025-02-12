"use client";

import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useNoteStore } from "@/stores/note";
import { useEditorStore } from "@/stores/editor";
import { Plus, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";


export const AppSidebar = () => {
  const { folders, createFolder } = useNoteStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { setCurrentNote } = useEditorStore();
  const { addNote } = useNoteStore();

  const handleEditFolder = (folderId: string, name: string) => {
    setEditingId(null);
    const folder = folders.find((folder) => folder.folderId === folderId);
    if (folder) {
      folder.name = name;
    }
  };

  const onAddNote = (folderId: string) => {
    const newNote: Note = {
      noteId: `note-${Date.now().toString()}`,
      title: "New Note",
      content: "",
      createdAt: new Date().toISOString(),
      folderId
    };

    addNote(folderId, newNote);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-[#f0f9ff/80]">
        <SidebarGroup>
          <SidebarGroupLabel className="py-7 mb-2 flex justify-between">
            <span className="text-xl font-medium text-neutral-900 dark:text-white">Textify <b className="font-black">Notes</b></span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Button
                className="w-full"
                variant="light-navy-secondary"
                onClick={() => createFolder("New Folder")}
              >
                Create folder
                <Plus className="h-4 w-4" />
              </Button>

              <div className="mt-5">
                {folders.map((folder) => (
                  <Collapsible
                    key={folder.folderId}
                    className="group/collapsible sidebar-menu"
                    defaultOpen
                  >
                    <SidebarMenuItem>
                      {editingId === folder.folderId ? (
                        <div className="flex gap-2 px-2">
                          <Input
                            defaultValue={folder.name}
                            onBlur={(e) => handleEditFolder(folder.folderId, e.target.value)}
                            className="h-8 outline-none w-full text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-black-pearl-50 dark:bg-black-pearl-950"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <CollapsibleTrigger className="sidebar-menu__trigger">
                            <SidebarMenuButton asChild className="sidebar-menu__trigger-btn">
                              <div>
                                <span className="font-semibold">{folder.name}</span>
                                <div className="sidebar-menu--actions">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 dark:hoder-bg-black-pearl-950"
                                    onClick={() => onAddNote(folder.folderId)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 dark:hoder-bg-black-pearl-950"
                                    onClick={() => setEditingId(folder.folderId)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="sidebar-menu__content">
                            {folder.notes.map((note) => (
                              <SidebarMenuSub
                                key={note.noteId}
                                onClick={() => setCurrentNote(note)}
                              >
                                <SidebarMenuSubItem className={cn("sidebar-menu-sub")}>
                                  <span>{note.title}</span>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 btn-delete-note"
                                    onClick={() => setCurrentNote(note)}
                                  >
                                    <Trash />
                                  </Button>
                                </SidebarMenuSubItem>
                              </SidebarMenuSub>
                            ))}
                          </CollapsibleContent>
                        </>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </div>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent >
    </Sidebar >
  );
};
