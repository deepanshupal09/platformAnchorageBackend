export const RoomsBookedPerDay = `
WITH daily_bookings AS (
  SELECT 
    dr.booking_date, 
    COUNT(b.room) AS rooms_booked
  FROM 
    generate_series(
      date_trunc('month', make_date($1, $2, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) AND $2 = EXTRACT(MONTH FROM current_date) THEN current_date
        ELSE date_trunc('month', make_date($1, $2, 1)) + interval '1 month' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
  GROUP BY 
    dr.booking_date
  ORDER BY 
    dr.booking_date
)
SELECT 
  booking_date, 
  rooms_booked
FROM 
  daily_bookings;
`;

export const averageCompanyBookingForMonthandYear = `
WITH daily_bookings AS (
  SELECT 
    dr.booking_date, 
    g.company, 
    COUNT(b.room) AS rooms_booked
  FROM 
    generate_series(
      date_trunc('month', make_date($1, $2, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) AND $2 = EXTRACT(MONTH FROM current_date) THEN current_date
        ELSE date_trunc('month', make_date($1, $2, 1)) + interval '1 month' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
  LEFT JOIN 
    guests g ON b.guest_email = g.email
  GROUP BY 
    dr.booking_date, g.company
)
SELECT 
  company, 
  AVG(rooms_booked) AS average_rooms_booked
FROM 
  daily_bookings
GROUP BY 
  company
ORDER BY 
  company;
`;


export const AverageMealsBoughtPerDay = `
WITH daily_meals AS (
  SELECT 
    dr.booking_date,
    (b.meal_veg + b.meal_non_veg) / (EXTRACT(EPOCH FROM (b.checkout - b.checkin)) / 86400 + 1) AS daily_meals
  FROM 
    generate_series(
      date_trunc('month', make_date($1, $2, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) AND $2 = EXTRACT(MONTH FROM current_date) THEN current_date
        ELSE date_trunc('month', make_date($1, $2, 1)) + interval '1 month' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
)
SELECT 
  booking_date, 
  AVG(daily_meals) AS average_meals_per_day
FROM 
  daily_meals
GROUP BY 
  booking_date
ORDER BY 
  booking_date;
`;

export const AverageBreakfastBoughtPerDay = `
WITH daily_breakfasts AS (
  SELECT 
    dr.booking_date,
    b.breakfast / (EXTRACT(EPOCH FROM (b.checkout - b.checkin)) / 86400 + 1) AS daily_breakfasts
  FROM 
    generate_series(
      date_trunc('month', make_date($1, $2, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) AND $2 = EXTRACT(MONTH FROM current_date) THEN current_date
        ELSE date_trunc('month', make_date($1, $2, 1)) + interval '1 month' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
)
SELECT 
  booking_date, 
  AVG(daily_breakfasts) AS average_breakfasts_per_day
FROM 
  daily_breakfasts
GROUP BY 
  booking_date
ORDER BY 
  booking_date;
`;

export const RoomsBookedPerQuarter = `
WITH quarterly_bookings AS (
  SELECT 
    dr.booking_date, 
    COUNT(b.room) AS rooms_booked
  FROM 
    generate_series(
      date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')),
      CASE 
        WHEN $1::int = EXTRACT(YEAR FROM current_date) AND $2::int = EXTRACT(QUARTER FROM current_date) THEN current_date
        ELSE date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')) + interval '3 months' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
  GROUP BY 
    dr.booking_date
  ORDER BY 
    dr.booking_date
)
SELECT 
  booking_date, 
  rooms_booked
FROM 
  quarterly_bookings;


`;


export const averageCompanyBookingForQuarterandYear = `
WITH quarterly_bookings AS (
  SELECT 
    dr.booking_date, 
    g.company, 
    COUNT(b.room) AS rooms_booked
  FROM 
    generate_series(
      date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')),
      CASE 
        WHEN $1::int = EXTRACT(YEAR FROM current_date) AND $2::int = EXTRACT(QUARTER FROM current_date) THEN current_date
        ELSE date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')) + interval '3 months' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
  LEFT JOIN 
    guests g ON b.guest_email = g.email
  GROUP BY 
    dr.booking_date, g.company
)
SELECT 
  company, 
  AVG(rooms_booked) AS average_rooms_booked
FROM 
  quarterly_bookings
GROUP BY 
  company
ORDER BY 
  company;
`;



export const AverageMealsBoughtPerQuarter = `
WITH quarterly_meals AS (
  SELECT 
    dr.booking_date,
    (b.meal_veg + b.meal_non_veg) / (EXTRACT(EPOCH FROM (b.checkout - b.checkin)) / 86400 + 1) AS daily_meals
  FROM 
    generate_series(
      date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')),
      CASE 
        WHEN $1::int = EXTRACT(YEAR FROM current_date) AND $2::int = EXTRACT(QUARTER FROM current_date) THEN current_date
        ELSE date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')) + interval '3 months' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
)
SELECT 
  booking_date, 
  AVG(daily_meals) AS average_meals_per_day
FROM 
  quarterly_meals
GROUP BY 
  booking_date
ORDER BY 
  booking_date;
`;



export const AverageBreakfastBoughtPerQuarter = `
WITH quarterly_breakfasts AS (
  SELECT 
    dr.booking_date,
    b.breakfast / (EXTRACT(EPOCH FROM (b.checkout - b.checkin)) / 86400 + 1) AS daily_breakfasts
  FROM 
    generate_series(
      date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')),
      CASE 
        WHEN $1::int = EXTRACT(YEAR FROM current_date) AND $2::int = EXTRACT(QUARTER FROM current_date) THEN current_date
        ELSE date_trunc('quarter', to_date($1::text || '-' || (($2 - 1) * 3 + 1)::text, 'YYYY-MM')) + interval '3 months' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
)
SELECT 
  booking_date, 
  AVG(daily_breakfasts) AS average_breakfasts_per_day
FROM 
  quarterly_breakfasts
GROUP BY 
  booking_date
ORDER BY 
  booking_date;
`;

export const RoomsBookedPerYear = `
WITH yearly_bookings AS (
  SELECT 
    dr.booking_date, 
    COUNT(b.room) AS rooms_booked
  FROM 
    generate_series(
      date_trunc('year', make_date($1, 1, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) THEN current_date
        ELSE date_trunc('year', make_date($1, 1, 1)) + interval '1 year' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
  GROUP BY 
    dr.booking_date
  ORDER BY 
    dr.booking_date
)
SELECT 
  booking_date, 
  rooms_booked
FROM 
  yearly_bookings;
`;

export const averageCompanyBookingForYear = `
WITH yearly_bookings AS (
  SELECT 
    dr.booking_date, 
    g.company, 
    COUNT(b.room) AS rooms_booked
  FROM 
    generate_series(
      date_trunc('year', make_date($1, 1, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) THEN current_date
        ELSE date_trunc('year', make_date($1, 1, 1)) + interval '1 year' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
  LEFT JOIN 
    guests g ON b.guest_email = g.email
  GROUP BY 
    dr.booking_date, g.company
)
SELECT 
  company, 
  AVG(rooms_booked) AS average_rooms_booked
FROM 
  yearly_bookings
GROUP BY 
  company
ORDER BY 
  company;
`;
export const AverageMealsBoughtPerYear = `
WITH yearly_meals AS (
  SELECT 
    dr.booking_date,
    (b.meal_veg + b.meal_non_veg) / (EXTRACT(EPOCH FROM (b.checkout - b.checkin)) / 86400 + 1) AS daily_meals
  FROM 
    generate_series(
      date_trunc('year', make_date($1, 1, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) THEN current_date
        ELSE date_trunc('year', make_date($1, 1, 1)) + interval '1 year' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
)
SELECT 
  booking_date, 
  AVG(daily_meals) AS average_meals_per_day
FROM 
  yearly_meals
GROUP BY 
  booking_date
ORDER BY 
  booking_date;
`;
export const AverageBreakfastBoughtPerYear = `
WITH yearly_breakfasts AS (
  SELECT 
    dr.booking_date,
    b.breakfast / (EXTRACT(EPOCH FROM (b.checkout - b.checkin)) / 86400 + 1) AS daily_breakfasts
  FROM 
    generate_series(
      date_trunc('year', make_date($1, 1, 1)),
      CASE 
        WHEN $1 = EXTRACT(YEAR FROM current_date) THEN current_date
        ELSE date_trunc('year', make_date($1, 1, 1)) + interval '1 year' - interval '1 day'
      END,
      interval '1 day'
    ) AS dr(booking_date)
  LEFT JOIN 
    (SELECT * FROM bookings UNION ALL SELECT * FROM logs) b 
    ON dr.booking_date BETWEEN b.checkin AND b.checkout
)
SELECT 
  booking_date, 
  AVG(daily_breakfasts) AS average_breakfasts_per_day
FROM 
  yearly_breakfasts
GROUP BY 
  booking_date
ORDER BY 
  booking_date;
`;


