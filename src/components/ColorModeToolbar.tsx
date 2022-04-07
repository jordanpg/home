import { DarkMode, LightMode } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import React from 'react';
import { ColorModeContext } from '../theme';

const ColorModeToolbar: React.FC = (props) => {
    const { toggleColorMode, isLight } = React.useContext(ColorModeContext);
    return (
        <AppBar position="static">
            <Toolbar>
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    { props.children }
                </div>
                <Tooltip title={isLight ? "Dark Mode" : "Light Mode"}>
                    <IconButton
                        size="large"
                        onClick={toggleColorMode}
                        color="inherit"
                        edge="end"
                    >
                        { isLight ? <DarkMode /> : <LightMode /> }
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default ColorModeToolbar;