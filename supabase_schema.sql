-- ==============================================================================
-- SCHEMA SUPABASE: PORTAL VELATORIOS ONLINE & PANTALLAS TV BOX (IDEMPOTENTE)
-- COCHERÍA J.V. GONZÁLEZ
-- ==============================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Velatorios y Servicios Online (con validaciones de seguridad)
CREATE TABLE IF NOT EXISTS public.wake_services (
    id TEXT PRIMARY KEY,
    deceased_name TEXT NOT NULL CHECK (char_length(deceased_name) BETWEEN 2 AND 100),
    birth_year TEXT CHECK (birth_year IS NULL OR char_length(birth_year) <= 4),
    passed_year TEXT CHECK (passed_year IS NULL OR char_length(passed_year) <= 4),
    age INTEGER CHECK (age IS NULL OR (age >= 0 AND age <= 130)),
    photo_url TEXT CHECK (photo_url IS NULL OR char_length(photo_url) <= 500),
    epitaph TEXT CHECK (epitaph IS NULL OR char_length(epitaph) <= 300),
    chapel_room TEXT NOT NULL,
    branch_name TEXT NOT NULL,
    cortege_time TEXT CHECK (cortege_time IS NULL OR char_length(cortege_time) <= 200),
    access_pin TEXT NOT NULL CHECK (char_length(access_pin) BETWEEN 4 AND 10),
    is_live BOOLEAN DEFAULT true,
    stream_url TEXT CHECK (stream_url IS NULL OR char_length(stream_url) <= 500),
    status TEXT DEFAULT 'en_vivo' CHECK (status IN ('preparacion', 'en_vivo', 'finalizado')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    candles_count INTEGER DEFAULT 0
);

-- 3. Tabla de Pantallas TV Box en Salas Físicas
CREATE TABLE IF NOT EXISTS public.tv_devices (
    device_code TEXT PRIMARY KEY,
    room_name TEXT NOT NULL,
    branch_name TEXT NOT NULL,
    assigned_wake_id TEXT REFERENCES public.wake_services(id) ON DELETE SET NULL,
    mode TEXT DEFAULT 'espera' CHECK (mode IN ('transmision', 'espera')),
    is_online BOOLEAN DEFAULT true,
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Condolencias y Homenajes en Vivo (con validaciones de seguridad)
CREATE TABLE IF NOT EXISTS public.wake_condolences (
    id TEXT PRIMARY KEY,
    wake_id TEXT NOT NULL REFERENCES public.wake_services(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL CHECK (char_length(sender_name) BETWEEN 1 AND 100),
    sender_city TEXT CHECK (sender_city IS NULL OR char_length(sender_city) <= 80),
    message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
    tribute_type TEXT DEFAULT 'candle' CHECK (tribute_type IN ('candle', 'flower', 'prayer', 'heart')),
    status TEXT DEFAULT 'aprobado' CHECK (status IN ('aprobado', 'pendiente', 'rechazado')),
    candle_lit BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.wake_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wake_condolences ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si ya existen para evitar el error 42710
DROP POLICY IF EXISTS "Lectura pública de velatorios" ON public.wake_services;
DROP POLICY IF EXISTS "Gestión de velatorios" ON public.wake_services;
DROP POLICY IF EXISTS "Gestión de velatorios autenticada" ON public.wake_services;
DROP POLICY IF EXISTS "Lectura pública de pantallas TV" ON public.tv_devices;
DROP POLICY IF EXISTS "Gestión de pantallas TV" ON public.tv_devices;
DROP POLICY IF EXISTS "Gestión de pantallas TV autenticada" ON public.tv_devices;
DROP POLICY IF EXISTS "Lectura pública de condolencias" ON public.wake_condolences;
DROP POLICY IF EXISTS "Inserción pública de condolencias" ON public.wake_condolences;
DROP POLICY IF EXISTS "Gestión de condolencias" ON public.wake_condolences;
DROP POLICY IF EXISTS "Moderación de condolencias autenticada" ON public.wake_condolences;
DROP POLICY IF EXISTS "Eliminación de condolencias autenticada" ON public.wake_condolences;

-- 1. Políticas para Velatorios
-- Lectura abierta para que los familiares y las pantallas TV puedan visualizar el velatorio
CREATE POLICY "Lectura pública de velatorios" ON public.wake_services FOR SELECT USING (true);
-- Creación, edición y eliminación restringidas a operadores autenticados
CREATE POLICY "Gestión de velatorios autenticada" ON public.wake_services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Políticas para Pantallas TV Box
-- Lectura abierta para los navegadores en las pantallas físicas de las salas
CREATE POLICY "Lectura pública de pantallas TV" ON public.tv_devices FOR SELECT USING (true);
-- Control y asignación de pantallas restringido a operadores autenticados
CREATE POLICY "Gestión de pantallas TV autenticada" ON public.tv_devices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Políticas para Condolencias y Homenajes
-- Familiares y allegados pueden ver las condolencias aprobadas y encender velas
CREATE POLICY "Lectura pública de condolencias" ON public.wake_condolences FOR SELECT USING (true);
-- Familiares y allegados pueden enviar un nuevo mensaje de condolencia
CREATE POLICY "Inserción pública de condolencias" ON public.wake_condolences FOR INSERT WITH CHECK (true);
-- Moderación (aprobar / rechazar) y eliminación restringidas exclusivamente al personal autenticado
CREATE POLICY "Moderación de condolencias autenticada" ON public.wake_condolences FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Eliminación de condolencias autenticada" ON public.wake_condolences FOR DELETE TO authenticated USING (true);

-- 6. Habilitar Supabase Realtime (Maneja si ya estaban añadidas)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wake_services;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tv_devices;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wake_condolences;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 7. Datos Iniciales de Salas y Pantallas TV Box (Modo espera / institucional 24hs)
INSERT INTO public.tv_devices (device_code, room_name, branch_name, mode, is_online)
VALUES
    ('TV-JVG-01', 'Sala Magna A', 'Casa Central • Joaquín V. González', 'espera', true),
    ('TV-JVG-02', 'Sala B (Capilla Menor)', 'Casa Central • Joaquín V. González', 'espera', true),
    ('TV-MET-01', 'Sala Memorial Metán', 'Sucursal San José de Metán', 'espera', true),
    ('TV-GUE-01', 'Sala Jardín Güemes', 'Sucursal General Güemes', 'espera', true)
ON CONFLICT (device_code) DO NOTHING;

