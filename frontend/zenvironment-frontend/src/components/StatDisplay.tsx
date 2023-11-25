import React from 'react';
import {Card, CardContent, Stack, SxProps, Theme, Typography} from "@mui/material";

export interface StatDisplayProps {
  title: string
  amount: string
  unit: string
  fact?: string
  sx?:  SxProps<Theme> | undefined
}

export const StatDisplay: React.FC<StatDisplayProps> = ({title, amount, unit, fact, sx}) => {
  return (

    <Card>
      <CardContent>
        <Stack sx={sx} spacing={2}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{textAlign: 'right'}}>
          {`${amount} ${unit}`}
        </Typography>
          {fact && (
            <Typography color="textSecondary" >
              {fact}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
