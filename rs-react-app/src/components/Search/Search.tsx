import React from 'react';
import type { SearchProps } from '../../types';

export class Search extends React.Component<SearchProps, { inputValue: string }> {
    state = {
        inputValue: this.props.searchTerm || '' 
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({ inputValue: value });
    };

    handleSearchClick = () => {
        const trimmedValue = this.state.inputValue.trim();
        this.props.onSearch(trimmedValue);
    };

    componentDidUpdate(prevProps: Readonly<SearchProps>) {
        if (prevProps.searchTerm !== this.props.searchTerm) {
            this.setState({inputValue: this.props.searchTerm || ''})
        }
    };

    render() {
        return (
            <div style={{ display: 'flex', gap: '10px', padding: '20px' }}>
                <input 
                data-testid="search-input"
                type="text"
                value={this.state.inputValue}
                onChange={this.handleInputChange}
                placeholder="Search..."
                style={{ flex: 1, padding: '8px' }}
                />
                <button
                onClick={this.handleSearchClick} 
                disabled={this.props.isLoading}
                >
                    Search
                </button>
            </div>
        );
    }
}