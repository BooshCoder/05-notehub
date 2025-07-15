import axios from "axios";
import { Note } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append("search", search);
  const { data } = await axios.get<FetchNotesResponse>(
    `https://notehub-public.goit.study/api/notes?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
    }
  );
  return data;
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const { data } = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    note,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
    }
  );
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
    }
  );
};