import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

export default function HeaderBar() {
    return (
        <Box width='100vw' bgcolor='primary.main'>
            <AppBar position='absolute' >
            <Toolbar>
                <Typography variant='h6'>Himawari</Typography>
            </Toolbar>
            </AppBar>
        </Box>
    );
}