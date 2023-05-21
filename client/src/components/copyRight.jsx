import { Typography } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Link } from 'react-router-dom';

    function Copyright(props) {
        return (
          <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
              Mehmet T.
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        );

      }

export default Copyright