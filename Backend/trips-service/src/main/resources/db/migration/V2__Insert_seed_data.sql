-- Insert seed data for testing
INSERT INTO trips (id, driver_id, origin, destination_sede_id, date_time, seats_total, seats_free) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'user-001', 'Madrid Centro', 'SEDE-1', '2025-10-06 08:30:00+00', 3, 3),
    ('550e8400-e29b-41d4-a716-446655440002', 'user-002', 'Madrid Norte', 'SEDE-1', '2025-10-06 09:00:00+00', 2, 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'user-003', 'Madrid Sur', 'SEDE-2', '2025-10-06 08:30:00+00', 4, 4),
    ('550e8400-e29b-41d4-a716-446655440004', 'user-004', 'Madrid Este', 'SEDE-1', '2025-10-07 08:30:00+00', 2, 1),
    ('550e8400-e29b-41d4-a716-446655440005', 'user-005', 'Madrid Oeste', 'SEDE-2', '2025-10-07 09:00:00+00', 3, 3);
