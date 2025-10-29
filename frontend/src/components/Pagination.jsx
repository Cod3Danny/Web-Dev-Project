// Pagination.jsx
import { useSearchParams } from "react-router-dom";
import './Pagination.css';

const Pagination = ({ page, totalPages, loading }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handlePageChange = (newPage) => {
        if (newPage < 1 || (totalPages && newPage > totalPages)) return;

        setSearchParams({ page: newPage });
    };

    return (
        <div id="pagination">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
            >
                Prev
            </button>

            <span>
                Page {page} {totalPages ? `of ${totalPages}` : ""}
            </span>

            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={totalPages ? page >= totalPages || loading : loading}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
