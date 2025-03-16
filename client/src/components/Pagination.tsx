import React from 'react';
import { Pagination as MuiPagination, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const theme = createTheme({
    components: {
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        fontSize: '1.2rem',
                        color: 'white',
                    },
                    '& .MuiPaginationItem-ellipsis': {
                        color: 'white', 
                    },
                    '& .MuiPaginationItem-icon': {
                        color: 'white',
                    },
                    '& .Mui-selected': {
                        backgroundColor: '#1976d2',
                        color: 'white',
                    },
                    '& .MuiPaginationItem-root.Mui-disabled': {
                        color: 'gray',
                    },
                },
            },
        },
    },
});

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
        onPageChange(page);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box mt={2} mb={2} p={2} bgcolor="rgba(0, 0, 0, 0.7)" borderRadius={1}>
                <MuiPagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handleChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontSize: '1.2rem',
                            color: 'white',
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: 'white',
                        },
                        '& .MuiPaginationItem-icon': {
                            color: 'white',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#1976d2',
                            color: 'white',
                        },
                        '& .MuiPaginationItem-root.Mui-disabled': {
                            color: 'gray',
                        },
                    }}
                />
            </Box>
        </ThemeProvider>
    );
};

export default Pagination;