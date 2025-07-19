import React, { useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import type { FetchNotesResponse } from "../../services/noteService";

const App: React.FC = () => {
   const [page, setPage] = useState(1);
   const [pageCount, setPageCount] = useState(0);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [debouncedSearch] = useDebounce(search, 500);

   const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
     queryKey: ["notes", page, debouncedSearch],
     queryFn: () => fetchNotes(page, 12, debouncedSearch),
     placeholderData: (prevData) => prevData,
   });

   React.useEffect(() => {
     if (data?.totalPages !== undefined) {
       setPageCount(data.totalPages);
     }
   }, [data]);

   const notes: Note[] = data?.notes || [];

   // Handler to reset page when search changes
   const handleSearchChange = (newSearch: string) => {
     setPage(1);
     setSearch(newSearch);
   };

   return (
     <div className={css.app}>
       <header className={css.toolbar}>
         <SearchBox value={search} onChange={handleSearchChange} />
         {notes.length > 0 && (
           <Pagination page={page} setPage={setPage} pageCount={pageCount} />
         )}
         <button
           type="button"
           className={css.button}
           onClick={() => setIsModalOpen(true)}
         >
           Create note +
         </button>
       </header>
       {notes.length > 0 && (
         <NoteList notes={notes} isLoading={isLoading} isError={isError} />
       )}
       {isModalOpen && (
         <Modal onClose={() => setIsModalOpen(false)}>
           <NoteForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
         </Modal>
       )}
     </div>
   );
};

export default App;