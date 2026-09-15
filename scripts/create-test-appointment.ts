import { db } from "../src/prisma/db";

const [patient] = await db.orm.public.Patient.createAll([
  {
    fullName: "Paciente de prueba",
  },
]);

await db.orm.public.Appointment.createAll([
  {
    patientId: patient.id,
    physiotherapistId: 1,
    startAt: "2026-09-15T08:30:00.000Z",
  },
]);

console.log("Test appointment created");