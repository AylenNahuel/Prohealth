import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { twoWeekSlots } from '../utils/calendar';

const Turnera = ({ value, onPick, occupiedSlots }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const days = useMemo(
    () => twoWeekSlots({ startHour: 9, endHour: 17, step: 30, excludeSundays: true }),
    []
  );
  const occupiedSet = useMemo(() => new Set(occupiedSlots), [occupiedSlots]);

  const findDayIndexBySlot = (slotISO) => {
    if (!slotISO) return 0;
    return Math.max(
      0,
      days.findIndex((day) => day.slots.some((slot) => slot.iso === slotISO))
    );
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(findDayIndexBySlot(value));
  const [selectedSlot, setSelectedSlot] = useState(value || '');

  useEffect(() => {
    setSelectedSlot(value || '');
    const newIndex = findDayIndexBySlot(value);
    if (newIndex !== -1) {
      setSelectedDayIndex(newIndex);
    }
  }, [value, days]);

  const handleDaySelect = (index) => {
    setSelectedDayIndex(index);
  };

  const handleSlotClick = (slotISO) => {
    if (occupiedSet.has(slotISO)) return;
    setSelectedSlot(slotISO);
    onPick(slotISO);
  };

  const selectedDay = days[selectedDayIndex] || days[0];

  return (
    <Stack spacing={3}>
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ minWidth: 'max-content' }}
        >
          {days.map((day, index) => {
            const isSelected = index === selectedDayIndex;
            return (
              <Paper
                key={day.date}
                onClick={() => handleDaySelect(index)}
                elevation={isSelected ? 6 : 1}
                sx={{
                  cursor: 'pointer',
                  px: 3,
                  py: 2,
                  minWidth: 120,
                  borderRadius: 3,
                  border: (themeArg) =>
                    `1px solid ${isSelected ? themeArg.palette.primary.main : themeArg.palette.divider}`,
                  bgcolor: isSelected ? theme.palette.primary.main : theme.palette.background.paper,
                  color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  transition: 'all 0.2s ease',
                }}
              >
                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                  {dayjs(day.iso).format('dddd')}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {dayjs(day.iso).format('DD/MM')}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Horarios disponibles
        </Typography>
        <Grid container spacing={1.5}>
          {selectedDay?.slots.map((slot) => {
            const isOccupied = occupiedSet.has(slot.iso);
            const isSelected = selectedSlot === slot.iso;
            return (
              <Grid item key={slot.iso} xs={4} sm={3} md={2}>
                <Chip
                  label={slot.label}
                  onClick={() => handleSlotClick(slot.iso)}
                  clickable={!isOccupied}
                  disabled={isOccupied}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
                    width: '100%',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: isSelected
                      ? 'primary.main'
                      : isOccupied
                      ? 'divider'
                      : 'rgba(0,0,0,0.08)',
                    bgcolor: isOccupied ? 'action.disabledBackground' : 'background.paper',
                    color: isOccupied ? 'text.disabled' : undefined,
                    fontWeight: isSelected ? 600 : 500,
                    '&.Mui-disabled': {
                      opacity: 1,
                    },
                  }}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Stack>
  );
};

Turnera.propTypes = {
  value: PropTypes.string,
  onPick: PropTypes.func,
  occupiedSlots: PropTypes.arrayOf(PropTypes.string),
};

Turnera.defaultProps = {
  value: '',
  onPick: () => {},
  occupiedSlots: [],
};

export default Turnera;
