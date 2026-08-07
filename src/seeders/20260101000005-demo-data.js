'use strict';

// ---------------------------------------------------------------------------
// Seeder de datos de demostracion: genera clientes, motos, ordenes de trabajo
// e items realistas para poder probar el sistema con datos desde el inicio.
// ---------------------------------------------------------------------------

const PRIMEROS = [
  'Carlos', 'Maria', 'Luis', 'Ana', 'Jose', 'Laura', 'Diego', 'Sofia', 'Andres', 'Paola',
  'Roberto', 'Daniela', 'Fernando', 'Gabriela', 'Ricardo', 'Valeria', 'Esteban', 'Camila',
  'Mauricio', 'Karen', 'Alejandro', 'Marcela', 'Jorge', 'Melissa', 'Kevin',
];
const APELLIDOS = [
  'Ramirez', 'Fernandez', 'Mora', 'Solis', 'Vargas', 'Jimenez', 'Rojas', 'Chacon', 'Alvarado',
  'Castro', 'Gomez', 'Sanchez', 'Zamora', 'Quesada', 'Hernandez', 'Villalobos', 'Araya',
  'Barrantes', 'Mendez', 'Salas',
];
const DIRECCIONES = [
  'Pasto, Centro', 'Pasto, La Aurora', 'Pasto, Chapal', 'Pasto, Tamasagra',
  'Pasto, San Vicente', 'Pasto, Torobajo', 'Pasto, La Rosa', 'Pasto, Panamericana',
  'Ipiales Centro', 'Tumaco Centro', 'Chachagüí', 'La Unión, Nariño',
];

const MOTOS_CATALOGO = [
  ['Honda', 'CB190R', 190], ['Honda', 'XR150L', 150], ['Honda', 'CBF150', 150],
  ['Yamaha', 'FZ25', 250], ['Yamaha', 'YBR125', 125], ['Yamaha', 'MT-03', 320],
  ['Suzuki', 'GN125', 125], ['Suzuki', 'GSX150', 150],
  ['Bajaj', 'Pulsar NS200', 200], ['Bajaj', 'Boxer CT100', 100],
  ['KTM', 'Duke 200', 200], ['TVS', 'Apache RTR', 160],
  ['Kawasaki', 'Z300', 300], ['Italika', 'FT150', 150], ['AKT', 'NKD 125', 125],
];
const COLORES = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Gris', 'Verde', 'Naranja', 'Plateado'];

const FALLAS = [
  'Ruido en el motor al acelerar',
  'No enciende / falla de arranque',
  'Frenos suenan y no responden bien',
  'Perdida de potencia en subidas',
  'Fuga de aceite visible en el motor',
  'Vibracion excesiva en el manubrio',
  'Cadena floja y desgastada',
  'Bateria no carga correctamente',
  'Luces delanteras no encienden',
  'Recalentamiento del motor',
  'Mantenimiento preventivo programado',
  'Cambio de aceite y filtro de rutina',
  'Llanta trasera desgastada, requiere cambio',
  'Ruido metalico en la suspension trasera',
];
const OBSERVACIONES = [
  'Cliente solicita revision general antes de viaje largo',
  'Repuesto pendiente de confirmar disponibilidad',
  'Cliente autoriza presupuesto por telefono',
  'Moto con golpe leve en el tanque, no relacionado a la falla',
  null, null, null,
];
const RESPONSABLES = ['Taller Pavas', 'Mecanico Diego Rojas', 'Mecanico Andres Salas', 'Jefe de taller'];

const ITEMS_CATALOGO = [
  { tipo: 'REPUESTO', descripcion: 'Kit de arrastre (cadena + piñones)', min: 130000, max: 220000 },
  { tipo: 'REPUESTO', descripcion: 'Pastillas de freno delanteras', min: 25000, max: 55000 },
  { tipo: 'REPUESTO', descripcion: 'Bateria 12V', min: 95000, max: 180000 },
  { tipo: 'REPUESTO', descripcion: 'Aceite de motor 20W-50 (litro)', min: 18000, max: 30000 },
  { tipo: 'REPUESTO', descripcion: 'Filtro de aceite', min: 12000, max: 22000 },
  { tipo: 'REPUESTO', descripcion: 'Bujia', min: 10000, max: 20000 },
  { tipo: 'REPUESTO', descripcion: 'Llanta trasera', min: 130000, max: 230000 },
  { tipo: 'REPUESTO', descripcion: 'Kit de empaques de motor', min: 45000, max: 80000 },
  { tipo: 'REPUESTO', descripcion: 'Cable de acelerador', min: 15000, max: 30000 },
  { tipo: 'REPUESTO', descripcion: 'Bombillo de faro delantero', min: 12000, max: 25000 },
  { tipo: 'MANO_DE_OBRA', descripcion: 'Cambio de aceite y filtro', min: 15000, max: 25000 },
  { tipo: 'MANO_DE_OBRA', descripcion: 'Ajuste y limpieza de carburador', min: 30000, max: 50000 },
  { tipo: 'MANO_DE_OBRA', descripcion: 'Revision general de frenos', min: 25000, max: 45000 },
  { tipo: 'MANO_DE_OBRA', descripcion: 'Diagnostico electrico completo', min: 35000, max: 60000 },
  { tipo: 'MANO_DE_OBRA', descripcion: 'Mantenimiento preventivo (revision 3000km)', min: 40000, max: 70000 },
  { tipo: 'MANO_DE_OBRA', descripcion: 'Instalacion de kit de arrastre', min: 25000, max: 45000 },
];

const N_CLIENTES = 80;
const N_MOTOS = 100;
const N_ORDENES = 150;

// Distribucion de estados para las ordenes (debe sumar N_ORDENES)
const DISTRIBUCION_ESTADOS = [
  ...Array(28).fill('RECIBIDA'),
  ...Array(24).fill('DIAGNOSTICO'),
  ...Array(26).fill('EN_PROCESO'),
  ...Array(18).fill('LISTA'),
  ...Array(45).fill('ENTREGADA'),
  ...Array(9).fill('CANCELADA'),
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr, i) {
  return arr[i % arr.length];
}
function diasAtras(dias) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
}

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // ---------------- CLIENTES ----------------
    const clientes = Array.from({ length: N_CLIENTES }, (_, i) => {
      const nombre = `${pick(PRIMEROS, i)} ${pick(APELLIDOS, i + 7)}`;
      return {
        nombre,
        documento: `CI-${(1000 + i).toString()}-${(200 + i).toString()}`,
        telefono: `8${(800 + i * 3).toString().slice(0, 3)}-${(1000 + i * 17).toString().slice(0, 4)}`,
        email: `${nombre.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        direccion: pick(DIRECCIONES, i),
        created_at: now,
        updated_at: now,
      };
    });
    await queryInterface.bulkInsert('clientes', clientes);

    // ---------------- MOTOS ----------------
    const motos = Array.from({ length: N_MOTOS }, (_, i) => {
      const [marca, modelo, cilindraje] = pick(MOTOS_CATALOGO, i);
      return {
        placa: `MOT-${(i + 1).toString().padStart(3, '0')}`,
        marca,
        modelo,
        cilindraje,
        color: pick(COLORES, i + 2),
        kilometraje: randInt(500, 45000),
        observaciones: pick(OBSERVACIONES, i),
        cliente_id: (i % N_CLIENTES) + 1,
        created_at: now,
        updated_at: now,
      };
    });
    await queryInterface.bulkInsert('motos', motos);

    // ---------------- ORDENES ----------------
    const ordenes = Array.from({ length: N_ORDENES }, (_, i) => {
      const estado = DISTRIBUCION_ESTADOS[i];
      const moto_id = (i % N_MOTOS) + 1;
      const cliente_id = motos[moto_id - 1].cliente_id;
      const diasIngreso = randInt(1, 120);
      const fecha_ingreso = diasAtras(diasIngreso);
      const fecha_entrega = estado === 'ENTREGADA' ? diasAtras(Math.max(0, diasIngreso - randInt(1, 4))) : null;

      return {
        moto_id,
        cliente_id,
        fecha_ingreso,
        fecha_entrega,
        descripcion_falla: pick(FALLAS, i),
        observaciones: pick(OBSERVACIONES, i + 3),
        estado,
        responsable: estado === 'RECIBIDA' ? null : pick(RESPONSABLES, i),
        total: 0, // se recalcula abajo segun los items generados
        created_at: fecha_ingreso,
        updated_at: now,
      };
    });
    await queryInterface.bulkInsert('ordenes', ordenes);

    // ---------------- ITEMS ----------------
    // RECIBIDA y CANCELADA normalmente aun no tienen items cargados.
    const items = [];
    const totalesPorOrden = {};

    ordenes.forEach((orden, idx) => {
      const orden_id = idx + 1;
      if (orden.estado === 'RECIBIDA' || orden.estado === 'CANCELADA') return;

      const cantidadItems = randInt(1, 4);
      let totalOrden = 0;

      for (let k = 0; k < cantidadItems; k++) {
        const base = ITEMS_CATALOGO[randInt(0, ITEMS_CATALOGO.length - 1)];
        const cantidad = base.tipo === 'MANO_DE_OBRA' ? 1 : randInt(1, 2);
        const precio_unitario = randInt(base.min, base.max);
        const subtotal = cantidad * precio_unitario;
        totalOrden += subtotal;

        items.push({
          orden_id,
          tipo: base.tipo,
          descripcion: base.descripcion,
          cantidad,
          precio_unitario,
          subtotal,
          created_at: orden.fecha_ingreso,
          updated_at: now,
        });
      }
      totalesPorOrden[orden_id] = totalOrden;
    });

    await queryInterface.bulkInsert('items', items);

    // Recalcular el total de cada orden segun sus items
    await Promise.all(
      Object.entries(totalesPorOrden).map(([orden_id, total]) =>
        queryInterface.bulkUpdate('ordenes', { total }, { id: orden_id })
      )
    );

    // eslint-disable-next-line no-console
    console.log(
      `Seed generado: ${clientes.length} clientes, ${motos.length} motos, ` +
        `${ordenes.length} ordenes, ${items.length} items ` +
        `(total: ${clientes.length + motos.length + ordenes.length + items.length} registros)`
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('items', null, {});
    await queryInterface.bulkDelete('ordenes', null, {});
    await queryInterface.bulkDelete('motos', null, {});
    await queryInterface.bulkDelete('clientes', null, {});
  },
};
