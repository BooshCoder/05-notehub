import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

interface NoteListProps {
  page: number;
  perPage: number;
  setTotal: Dispatch<SetStateAction<number>>;
  search: string;
}

const NoteList: React.FC<NoteListProps> = ({ page, perPage, setTotal, search }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes(page, perPage, search),
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  useEffect(() => {
    if (data?.totalPages !== undefined) {
      setTotal(data.totalPages);
    }
  }, [data, setTotal]);

  const notes = data?.notes || [];

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage />;
  if (notes.length === 0) return <EmptyState message="Нотаток не знайдено" />;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.status === 'pending'}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;