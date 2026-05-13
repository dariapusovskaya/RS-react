interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) => {
  if (isLoading || totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        end = maxVisible;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '20px',
      padding: '16px 0'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: currentPage === 1 ? '#f0f0f0' : '#ffffff',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        ← Previous
      </button>
      
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: page === currentPage ? '#007bff' : '#ffffff',
            color: page === currentPage ? '#ffffff' : '#000000',
            fontWeight: page === currentPage ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#ffffff',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;