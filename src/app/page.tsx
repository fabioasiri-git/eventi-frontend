"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://unwqyqguxiumkrnlxatz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3F5cWd1eGl1bWtybmx4YXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzQxMDAsImV4cCI6MjA2ODUxMDEwMH0.rr2by4ydY5u87t-eDhnzGfrUcx51qUC-arBFIYNFimw"
);

type Evento = {
  id?: number;
  nome_evento?: string;
  data_evento?: string;
  luogo?: string;
  nome_responsabile?: string;
  telefono?: string;
  email?: string;
  sito_provenienza?: string;
  tipo_evento?: string;
  stato_contatto?: string;
  data_email_inviata?: string;
  note?: string;
};

export default function Home() {
  const [eventi, setEventi] = useState([] as Evento[]);
  const [form, setForm] = useState<Evento>({
    nome_evento: "",
    data_evento: "",
    luogo: "",
    nome_responsabile: "",
    telefono: "",
    email: "",
    sito_provenienza: "",
    tipo_evento: "",
    stato_contatto: "",
    data_email_inviata: "",
    note: "",
  });

  useEffect(() => {
    fetchEventi();
  }, []);

  async function fetchEventi() {
    const { data } = await supabase
      .from("eventi")
      .select("*")
      .order("data_evento", { ascending: true });
    setEventi((data as Evento[]) || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("eventi").insert([form]);
    setForm({
      nome_evento: "",
      data_evento: "",
      luogo: "",
      nome_responsabile: "",
      telefono: "",
      email: "",
      sito_provenienza: "",
      tipo_evento: "",
      stato_contatto: "",
      data_email_inviata: "",
      note: "",
    });
    fetchEventi();
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Eventi in Toscana</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          placeholder="Nome evento"
          value={form.nome_evento}
          onChange={e => setForm(f => ({ ...f, nome_evento: e.target.value }))}
        /><br />
        <input
          type="date"
          placeholder="Data evento"
          value={form.data_evento}
          onChange={e => setForm(f => ({ ...f, data_evento: e.target.value }))}
        /><br />
        <input
          placeholder="Luogo"
          value={form.luogo}
          onChange={e => setForm(f => ({ ...f, luogo: e.target.value }))}
        /><br />
        <input
          placeholder="Nome responsabile"
          value={form.nome_responsabile}
          onChange={e => setForm(f => ({ ...f, nome_responsabile: e.target.value }))}
        /><br />
        <input
          placeholder="Telefono"
          value={form.telefono}
          onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
        /><br />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        /><br />
        <input
          placeholder="Sito provenienza"
          value={form.sito_provenienza}
          onChange={e => setForm(f => ({ ...f, sito_provenienza: e.target.value }))}
        /><br />
        <input
          placeholder="Tipo evento (es: sagra, concerto, mostra...)"
          value={form.tipo_evento}
          onChange={e => setForm(f => ({ ...f, tipo_evento: e.target.value }))}
        /><br />
        <input
          placeholder="Stato contatto (es: da contattare, email inviata, risposta ricevuta)"
          value={form.stato_contatto}
          onChange={e => setForm(f => ({ ...f, stato_contatto: e.target.value }))}
        /><br />
        <input
          type="datetime-local"
          placeholder="Data email inviata"
          value={form.data_email_inviata}
          onChange={e => setForm(f => ({ ...f, data_email_inviata: e.target.value }))}
        /><br />
        <textarea
          placeholder="Note"
          value={form.note}
          onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
        /><br />
        <button type="submit">Aggiungi evento</button>
      </form>
      <ul>
        {eventi.map(ev => (
          <li key={ev.id} style={{ background: "#eee", margin: 8, padding: 8, borderRadius: 8 }}>
            <strong>{ev.nome_evento}</strong> <br />
            {ev.data_evento} - {ev.luogo} <br />
            Responsabile: {ev.nome_responsabile} | Tel: {ev.telefono} | Email: {ev.email} <br />
            Sito: {ev.sito_provenienza} <br />
            Tipo: {ev.tipo_evento} <br />
            Stato: {ev.stato_contatto} <br />
            Data email: {ev.data_email_inviata} <br />
            Note: {ev.note}
          </li>
        ))}
      </ul>
    </div>
  );
}