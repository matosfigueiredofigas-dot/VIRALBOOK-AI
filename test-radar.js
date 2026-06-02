async function test() {
  const res = await fetch('http://localhost:3001/api/radar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: "SaaS B2B para Consultores focado em resolver problemas de Falta de Tempo utilizando IA e monetizado via Assinatura", country: "BR" })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
