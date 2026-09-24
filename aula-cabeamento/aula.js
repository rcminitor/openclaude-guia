// Sequência de cores T568A / T568B
const CORES = {
  laranja: "#f28c00", verde: "#2e9e44", azul: "#1f5fd1", marrom: "#7a4a1d", branco: "#ffffff"
};
const PADROES = {
  B: ["branco/laranja", "laranja", "branco/verde", "azul", "branco/azul", "verde", "branco/marrom", "marrom"],
  A: ["branco/verde", "verde", "branco/laranja", "azul", "branco/azul", "laranja", "branco/marrom", "marrom"]
};

function fundoFio(nome) {
  if (!nome.startsWith("branco/")) return CORES[nome];
  const c = CORES[nome.split("/")[1]];
  return `repeating-linear-gradient(180deg, #fff 0 12px, ${c} 12px 22px)`;
}

function mostrarPadrao(p) {
  document.getElementById("fios").innerHTML = PADROES[p].map((nome, i) =>
    `<li><div class="fio" style="background:${fundoFio(nome)}"><b>${i + 1}</b></div>${nome.replace("/", " / ")}</li>`
  ).join("");
  document.querySelectorAll(".botoes button").forEach(b =>
    b.classList.toggle("ativo", b.dataset.padrao === p));
}
document.querySelectorAll(".botoes button").forEach(b =>
  b.addEventListener("click", () => mostrarPadrao(b.dataset.padrao)));
mostrarPadrao("B");

// Etapas de crimpagem
const ETAPAS = [
  { t: "Preparação do cabo", img: "etapa1.jpeg",
    d: "Use a lâmina de decapagem do próprio alicate para remover cerca de <strong>2 a 3 centímetros</strong> da capa externa (azul ou cinza). Cuidado para <strong>não cortar nem arranhar o isolamento dos fios internos</strong>." },
  { t: "Destorcer e alinhar os fios", img: "etapa2.jpeg",
    d: "O cabo tem 4 pares trançados. Desfaça as tranças e <strong>deixe os 8 fios o mais retos e paralelos possível</strong> com os dedos. Isso facilita o encaixe no conector." },
  { t: "Organizar pelas cores", img: "etapa3.jpeg",
    d: "Ordene os fios da esquerda para a direita conforme o padrão escolhido. O <strong>T568B</strong> é o mais usado nas redes comerciais e residenciais modernas (veja a seção 3)." },
  { t: "Corte de alinhamento", img: "etapa4.jpeg",
    d: "Com os fios esticados, lado a lado e na sequência correta, use a tesoura do alicate para <strong>cortar as pontas de maneira reta</strong>." },
  { t: "Inserção e crimpagem", img: "etapa5.jpeg",
    d: "Insira os fios no RJ45 até o fim e coloque o conector no <strong>berço correspondente</strong> do alicate. Empurre o cabo para dentro e aperte o alicate com força até o fim: ele trava e destrava. Os pinos perfuram a capa dos fios e fazem contato elétrico, e a capa externa fica travada." },
  { t: "Teste do cabo", img: "etapa6.jpeg",
    d: "Repita o processo na outra ponta. Conecte as duas pontas no <strong>testador de cabo de rede</strong>. Se as luzes de 1 a 8 acenderem na mesma ordem nas duas pontas, o cabo está pronto!" }
];
const feitos = new Set();
let atual = 0;

function desenharEtapas() {
  document.getElementById("passos").innerHTML = ETAPAS.map((e, i) =>
    `<button class="${i === atual ? "ativo" : ""} ${feitos.has(i) ? "feito" : ""}" data-i="${i}">${i + 1}. ${e.t}</button>`
  ).join("");
  const e = ETAPAS[atual];
  document.getElementById("detalhe").innerHTML = `
    <img src="img/${e.img}" alt="${e.t}">
    <div>
      <h3>Etapa ${atual + 1}: ${e.t}</h3>
      <p>${e.d}</p>
      <label><input type="checkbox" id="chk" ${feitos.has(atual) ? "checked" : ""}> Concluí esta etapa</label>
      <div class="nav-passo">
        <button id="ant" ${atual === 0 ? "disabled" : ""}>← Anterior</button>
        <button id="prox" ${atual === ETAPAS.length - 1 ? "disabled" : ""}>Próxima →</button>
      </div>
    </div>`;
  document.querySelectorAll("#passos button").forEach(b =>
    b.addEventListener("click", () => { atual = +b.dataset.i; desenharEtapas(); }));
  document.getElementById("chk").addEventListener("change", ev => {
    ev.target.checked ? feitos.add(atual) : feitos.delete(atual); desenharEtapas();
  });
  document.getElementById("ant").onclick = () => { atual--; desenharEtapas(); };
  document.getElementById("prox").onclick = () => { atual++; desenharEtapas(); };
}
desenharEtapas();

// Quiz
const QUIZ = [
  { p: "Por que os fios do cabo par trançado são entrelaçados?",
    o: ["Para deixar o cabo mais bonito", "Para cancelar interferências e o crosstalk", "Para aumentar a voltagem", "Para facilitar a crimpagem"], c: 1 },
  { p: "Qual é a velocidade máxima do Cat6 em distâncias curtas (até 37–55 m)?",
    o: ["100 Mbps", "1 Gbps", "10 Gbps", "40 Gbps"], c: 2 },
  { p: "Qual o fio do pino 1 no padrão T568B?",
    o: ["Branco/verde", "Verde", "Laranja", "Branco/laranja"], c: 3 },
  { p: "Quanto da capa externa se remove na preparação do cabo?",
    o: ["Cerca de 2 a 3 cm", "Cerca de 10 cm", "Apenas 0,5 cm", "Toda a capa"], c: 0 },
  { p: "No teste, o que indica que o cabo está correto?",
    o: ["Só a luz 1 acende", "As luzes de 1 a 8 acendem na mesma ordem nas duas pontas", "As luzes piscam aleatoriamente", "Nenhuma luz acende"], c: 1 }
];
let acertos = 0, respondidas = 0;
document.getElementById("perguntas").innerHTML = QUIZ.map((q, i) => `
  <div class="pergunta"><p>${i + 1}. ${q.p}</p>
    <div class="opcoes">${q.o.map((o, j) => `<button data-q="${i}" data-o="${j}">${o}</button>`).join("")}</div>
  </div>`).join("");
document.querySelectorAll(".opcoes button").forEach(b => b.addEventListener("click", () => {
  const q = QUIZ[b.dataset.q], grupo = b.parentElement;
  if (grupo.dataset.ok) return;
  grupo.dataset.ok = 1; respondidas++;
  if (+b.dataset.o === q.c) acertos++; else b.classList.add("errado");
  grupo.children[q.c].classList.add("certo");
  if (respondidas === QUIZ.length)
    document.getElementById("resultado").textContent = `Você acertou ${acertos} de ${QUIZ.length}! ${acertos === QUIZ.length ? "🎉 Excelente!" : "Revise os tópicos e tente de novo."}`;
}));
