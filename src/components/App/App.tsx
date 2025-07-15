import React, { useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";

const App: React.FC = () => {
   const [page, setPage] = useState(1);
   const [pageCount, setPageCount] = useState(0);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [debouncedSearch] = useDebounce(search, 500);

   return (
     <div className={css.app}>
       <header className={css.toolbar}>
         <SearchBox value={search} onChange={setSearch} />
         <Pagination page={page} setPage={setPage} pageCount={pageCount} />
         <button
           type="button"
           className={css.button}
           onClick={() => setIsModalOpen(true)}
         >
           Create note +
         </button>
       </header>
       <NoteList
         page={page}
         perPage={12}
         setTotal={setPageCount}
         search={debouncedSearch}
       />
       <Pagination page={page} setPage={setPage} pageCount={pageCount} />
       {isModalOpen && (
         <Modal onClose={() => setIsModalOpen(false)}>
           <NoteForm onSuccess={() => setIsModalOpen(false)} />
         </Modal>
       )}
     </div>
   );
};

export default App;