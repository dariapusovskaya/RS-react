import { useSelectedItemsStore } from "../../store/useSelectedItemsStore";
import type { Item } from "../../types";


interface FlyoutProps {
    items: Item[];
}

export const Flyout = ({ items }: FlyoutProps) => {
    const { unselectAll, getSelectedIds, getSelectedCount } = useSelectedItemsStore();
    const selectedCount = getSelectedCount();

    const selectedItems = items.filter(item => getSelectedIds().includes(item.id));

    const handleDownload = () => {
        if (selectedItems.length === 0) return;

        const headers = ['ID', 'Name', 'Description', 'Details URL'];
        const rows = selectedItems.map(item => [
            item.id,
            item.name,
            item.description,
            window.location.origin + `/details/${item.id}`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedItems.length}_items.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (selectedCount === 0) {
        return null;
    };

    return (
        <div style={{
            position: 'sticky',
            bottom: '20px',
            marginTop: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
        }}>
        <span>✅ Selected: {selectedCount} item{selectedCount !== 1 ? 's' : ''}</span>
        <div style={{ display: 'flex', gap: '12px' }}>
        <button
            onClick={unselectAll}
            style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
        }}
        >
          Unselect all
        </button>
        <button
          onClick={handleDownload}
          style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
          }}
        >
          Download CSV
        </button>
      </div>
    </div>
    )
}

