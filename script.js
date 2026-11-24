/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const STORAGE_KEY = "relacoes_app_data";

const DATA_VERSION = 1;


/* =====================================================
   ESTADO
===================================================== */

let relations = loadRelations();

let currentEvaluationRelationId = null;


/* =====================================================
   PERGUNTAS
===================================================== */

const questions = [

  {
    id: "importance",

    title:
      "O quanto essa relação é importante para você?",

    minLabel:
      "Pouco importante",

    maxLabel:
      "Extremamente importante"
  },


  {
    id: "wear",

    title:
      "Quanto essa relação tem causado desgaste?",

    minLabel:
      "Nenhum desgaste",

    maxLabel:
      "Desgaste extremo"
  },


  {
    id: "values",

    title:
      "Quanto os conflitos de valores são importantes para você?",

    minLabel:
      "Pouco importantes",

    maxLabel:
      "Fundamentais"
  },


  {
    id: "trust",

    title:
      "Quanto você confia nessa pessoa?",

    minLabel:
      "Não confio",

    maxLabel:
      "Confio totalmente"
  },


  {
    id: "boundaries",

    title:
      "Quanto seus limites são respeitados nessa relação?",

    minLabel:
      "Não são respeitados",

    maxLabel:
      "São plenamente respeitados"
  },


  {
    id: "coexistence",

    title:
      "Quanto você acredita ser possível conviver com as diferenças?",

    minLabel:
      "Não consigo conviver",

    maxLabel:
      "Consigo conviver tranquilamente"
  }

];


/* =====================================================
   DOM
===================================================== */

const relationsList =
  document.getElementById(
    "relationsList"
  );


const relationsSummary =
  document.getElementById(
    "relationsSummary"
  );


const relationModal =
  document.getElementById(
    "relationModal"
  );


const evaluationModal =
  document.getElementById(
    "evaluationModal"
  );


const resultModal =
  document.getElementById(
    "resultModal"
  );


const relationForm =
  document.getElementById(
    "relationForm"
  );


const relationIdInput =
  document.getElementById(
    "relationId"
  );


const relationNameInput =
  document.getElementById(
    "relationName"
  );


const relationTypeInput =
  document.getElementById(
    "relationType"
  );


const relationNotesInput =
  document.getElementById(
    "relationNotes"
  );


const relationModalTitle =
  document.getElementById(
    "relationModalTitle"
  );


const evaluationTitle =
  document.getElementById(
    "evaluationTitle"
  );


const evaluationContent =
  document.getElementById(
    "evaluationContent"
  );


const resultContent =
  document.getElementById(
    "resultContent"
  );


const importFile =
  document.getElementById(
    "importFile"
  );


/* =====================================================
   LOCAL STORAGE
===================================================== */

function loadRelations() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!saved) {
      return [];
    }


    const data =
      JSON.parse(saved);


    if (!Array.isArray(data)) {
      return [];
    }


    return data;

  } catch (error) {

    console.error(
      "Erro ao carregar dados:",
      error
    );

    return [];
  }
}


function saveRelations() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(relations)
    );

  } catch (error) {

    console.error(
      "Erro ao salvar dados:",
      error
    );

    alert(
      "Não foi possível salvar os dados neste navegador."
    );
  }
}


/* =====================================================
   UTILIDADES
===================================================== */

function generateId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );
}


function formatDate(date) {

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(
    new Date(date)
  );
}


function formatDateTime(date) {

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(
    new Date(date)
  );
}


function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }


  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =====================================================
   RESUMO
===================================================== */

function renderSummary() {

  const total =
    relations.length;


  const evaluations =
    relations.reduce(
      (total, relation) => {

        return (
          total +
          (relation.evaluations?.length || 0)
        );

      },
      0
    );


  relationsSummary.innerHTML = `

    <div class="summary-item">
      <strong>${total}</strong>
      relação${total === 1 ? "" : "ões"}
    </div>

    <div class="summary-item">
      <strong>${evaluations}</strong>
      avaliação${evaluations === 1 ? "" : "ões"}
    </div>

  `;
}


/* =====================================================
   RENDER RELAÇÕES
===================================================== */

function renderRelations() {

  renderSummary();


  if (relations.length === 0) {

    relationsList.innerHTML = `

      <div class="empty-state">

        <h2>
          Nenhuma relação cadastrada
        </h2>

        <p>
          Cadastre uma relação para começar
          a construir seu mapa pessoal.
        </p>

      </div>

    `;

    return;
  }


  relationsList.innerHTML =
    relations
      .map(
        relation => {

          const evaluations =
            relation.evaluations || [];


          const lastEvaluation =
            evaluations.length
              ? evaluations[
                  evaluations.length - 1
                ]
              : null;


          const evaluationText =
            lastEvaluation
              ? `Última avaliação:
                 ${formatDate(lastEvaluation.date)}`
              : "Ainda não avaliada";


          return `

            <article
              class="relation-card"
            >

              <div
                class="relation-card-header"
              >

                <div>

                  <div
                    class="relation-name"
                  >
                    ${escapeHTML(
                      relation.name
                    )}
                  </div>


                  <div
                    class="relation-type"
                  >
                    ${escapeHTML(
                      relation.type
                    )}
                  </div>

                </div>

              </div>


              ${
                relation.notes
                  ? `
                    <div
                      class="relation-notes"
                    >
                      ${escapeHTML(
                        relation.notes
                      )}
                    </div>
                  `
                  : ""
              }


              <div
                class="relation-date"
              >
                ${evaluationText}
              </div>


              ${
                evaluations.length
                  ? `
                    <div
                      class="evaluation-count"
                    >
                      ${evaluations.length}
                      avaliação${
                        evaluations.length === 1
                          ? ""
                          : "ões"
                      }
                    </div>
                  `
                  : ""
              }


              <div
                class="card-actions"
              >

                <button
                  class="small-button primary"
                  onclick="startEvaluation('${relation.id}')"
                >
                  Avaliar
                </button>


                <button
                  class="small-button"
                  onclick="showHistory('${relation.id}')"
                >
                  Histórico
                </button>


                <button
                  class="small-button"
                  onclick="editRelation('${relation.id}')"
                >
                  Editar
                </button>


                <button
                  class="small-button danger"
                  onclick="deleteRelation('${relation.id}')"
                >
                  Excluir
                </button>

              </div>

            </article>

          `;
        }
      )
      .join("");
}


/* =====================================================
   MODAL DE RELAÇÃO
===================================================== */

function openRelationModal(
  relation = null
) {

  relationModal.classList.remove(
    "hidden"
  );


  if (relation) {

    relationModalTitle.textContent =
      "Editar relação";


    relationIdInput.value =
      relation.id;


    relationNameInput.value =
      relation.name;


    relationTypeInput.value =
      relation.type;


    relationNotesInput.value =
      relation.notes || "";

  } else {

    relationModalTitle.textContent =
      "Nova relação";


    relationIdInput.value =
      "";


    relationNameInput.value =
      "";


    relationTypeInput.value =
      "Amizade";


    relationNotesInput.value =
      "";
  }


  setTimeout(
    () => {
      relationNameInput.focus();
    },
    50
  );
}


function closeRelationModal() {

  relationModal.classList.add(
    "hidden"
  );
}


/* =====================================================
   SALVAR RELAÇÃO
===================================================== */

relationForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      relationNameInput
        .value
        .trim();


    const type =
      relationTypeInput.value;


    const notes =
      relationNotesInput
        .value
        .trim();


    if (!name) {

      alert(
        "Informe o nome da relação."
      );

      return;
    }


    const id =
      relationIdInput.value;


    if (id) {

      const relation =
        relations.find(
          item =>
            item.id === id
        );


      if (relation) {

        relation.name =
          name;

        relation.type =
          type;

        relation.notes =
          notes;
      }

    } else {

      relations.push({

        id:
          generateId(),

        name,

        type,

        notes,

        createdAt:
          new Date().toISOString(),

        evaluations: []

      });
    }


    saveRelations();

    renderRelations();

    closeRelationModal();
  }
);


/* =====================================================
   EDITAR
===================================================== */

function editRelation(id) {

  const relation =
    relations.find(
      item =>
        item.id === id
    );


  if (!relation) {
    return;
  }


  openRelationModal(
    relation
  );
}


/* =====================================================
   EXCLUIR
===================================================== */

function deleteRelation(id) {

  const relation =
    relations.find(
      item =>
        item.id === id
    );


  if (!relation) {
    return;
  }


  const confirmed =
    confirm(
      `Excluir a relação "${relation.name}"?\n\n` +
      "Todas as avaliações dessa relação também serão excluídas."
    );


  if (!confirmed) {
    return;
  }


  relations =
    relations.filter(
      item =>
        item.id !== id
    );


  saveRelations();

  renderRelations();
}


/* =====================================================
   AVALIAÇÃO
===================================================== */

function startEvaluation(id) {

  const relation =
    relations.find(
      item =>
        item.id === id
    );


  if (!relation) {
    return;
  }


  currentEvaluationRelationId =
    id;


  evaluationTitle.textContent =
    `Avaliação — ${relation.name}`;


  renderEvaluationQuestions();


  evaluationModal.classList.remove(
    "hidden"
  );
}


/* =====================================================
   RENDER PERGUNTAS
===================================================== */

function renderEvaluationQuestions() {

  evaluationContent.innerHTML =
    questions
      .map(
        question => {

          const options =
            Array.from(
              { length: 11 },
              (_, index) => {

                return `

                  <div
                    class="scale-option"
                  >

                    <input
                      type="radio"
                      name="${question.id}"
                      id="${question.id}-${index}"
                      value="${index}"
                    >


                    <label
                      for="${question.id}-${index}"
                    >
                      ${index}
                    </label>

                  </div>

                `;
              }
            )
            .join("");


          return `

            <div
              class="question"
            >

              <div
                class="question-title"
              >
                ${question.title}
              </div>


              <div
                class="scale"
              >
                ${options}
              </div>


              <div
                class="scale-description"
              >

                <span>
                  ${question.minLabel}
                </span>

                <span>
                  ${question.maxLabel}
                </span>

              </div>

            </div>

          `;
        }
      )
      .join("");
}


/* =====================================================
   SALVAR AVALIAÇÃO
===================================================== */

document
  .getElementById(
    "saveEvaluationButton"
  )
  .addEventListener(
    "click",
    saveEvaluation
  );


function saveEvaluation() {

  if (
    !currentEvaluationRelationId
  ) {
    return;
  }


  const answers = {};


  for (
    const question of questions
  ) {

    const selected =
      document.querySelector(
        `input[name="${question.id}"]:checked`
      );


    if (!selected) {

      alert(
        "Responda todas as perguntas antes de salvar."
      );

      return;
    }


    answers[question.id] =
      Number(
        selected.value
      );
  }


  const relation =
    relations.find(
      item =>
        item.id ===
        currentEvaluationRelationId
    );


  if (!relation) {
    return;
  }


  if (!relation.evaluations) {

    relation.evaluations = [];
  }


  const evaluation = {

    id:
      generateId(),

    date:
      new Date().toISOString(),

    answers

  };


  relation.evaluations.push(
    evaluation
  );


  saveRelations();

  renderRelations();

  closeEvaluationModal();

  showResult(
    relation,
    evaluation
  );
}


/* =====================================================
   ANÁLISE
===================================================== */

function showResult(
  relation,
  evaluation
) {

  const answers =
    evaluation.answers;


  const importance =
    answers.importance;


  const wear =
    answers.wear;


  const values =
    answers.values;


  const trust =
    answers.trust;


  const boundaries =
    answers.boundaries;


  const coexistence =
    answers.coexistence;


  const observations = [];


  /* -----------------------------------------------
     DESGASTE
  ------------------------------------------------ */

  if (wear >= 7) {

    observations.push(
      "O nível de desgaste relatado está alto."
    );

  } else if (wear >= 4) {

    observations.push(
      "Existe algum nível relevante de desgaste."
    );

  } else {

    observations.push(
      "O desgaste relatado está baixo."
    );
  }


  /* -----------------------------------------------
     VALORES
  ------------------------------------------------ */

  if (values >= 7) {

    observations.push(
      "As diferenças de valores parecem ter bastante importância para você."
    );

  } else if (values <= 3) {

    observations.push(
      "As diferenças de valores parecem ter pouca importância nesta avaliação."
    );
  }


  /* -----------------------------------------------
     LIMITES
  ------------------------------------------------ */

  if (boundaries <= 3) {

    observations.push(
      "O respeito aos seus limites recebeu uma avaliação baixa."
    );

  } else if (boundaries >= 8) {

    observations.push(
      "Você percebe seus limites como bem respeitados."
    );
  }


  /* -----------------------------------------------
     CONFIANÇA
  ------------------------------------------------ */

  if (trust <= 3) {

    observations.push(
      "A confiança relatada está baixa."
    );

  } else if (trust >= 8) {

    observations.push(
      "A confiança relatada está alta."
    );
  }


  /* -----------------------------------------------
     CONVIVÊNCIA
  ------------------------------------------------ */

  if (coexistence >= 7) {

    observations.push(
      "Você percebe uma possibilidade considerável de convivência com as diferenças."
    );

  } else if (coexistence <= 3) {

    observations.push(
      "Você percebe pouca possibilidade de convivência com as diferenças."
    );
  }


  resultContent.innerHTML = `

    <div
      class="result-section"
    >

      <h3>
        Relação
      </h3>

      <p>
        ${escapeHTML(
          relation.name
        )}
      </p>

      <small>
        Avaliação realizada em
        ${formatDateTime(
          evaluation.date
        )}
      </small>

    </div>


    <div
      class="result-section"
    >

      <h3>
        Seus indicadores
      </h3>


      <div
        class="result-grid"
      >

        <div
          class="result-item"
        >
          <strong>
            ${importance}/10
          </strong>

          <span>
            Importância
          </span>
        </div>


        <div
          class="result-item"
        >
          <strong>
            ${wear}/10
          </strong>

          <span>
            Desgaste
          </span>
        </div>


        <div
          class="result-item"
        >
          <strong>
            ${values}/10
          </strong>

          <span>
            Conflito de valores
          </span>
        </div>


        <div
          class="result-item"
        >
          <strong>
            ${trust}/10
          </strong>

          <span>
            Confiança
          </span>
        </div>


        <div
          class="result-item"
        >
          <strong>
            ${boundaries}/10
          </strong>

          <span>
            Respeito aos limites
          </span>
        </div>


        <div
          class="result-item"
        >
          <strong>
            ${coexistence}/10
          </strong>

          <span>
            Possibilidade de convivência
          </span>
        </div>

      </div>

    </div>


    <div
      class="result-section"
    >

      <h3>
        O que apareceu nesta avaliação
      </h3>


      <ul>

        ${observations
          .map(
            observation =>
              `<li>${observation}</li>`
          )
          .join("")}

      </ul>

    </div>


    <div
      class="reflection-box"
    >

      <strong>
        Para refletir
      </strong>

      <br>
      <br>

      Os dados não determinam o que você
      deve fazer com essa relação.

      <br>
      <br>

      Uma avaliação isolada também pode não
      representar toda a relação.

      <br>
      <br>

      Compare avaliações realizadas em momentos
      diferentes e observe se existe um padrão.

    </div>

  `;


  resultModal.classList.remove(
    "hidden"
  );
}


/* =====================================================
   HISTÓRICO
===================================================== */

function showHistory(id) {

  const relation =
    relations.find(
      item =>
        item.id === id
    );


  if (!relation) {
    return;
  }


  const evaluations =
    relation.evaluations || [];


  if (!evaluations.length) {

    alert(
      "Essa relação ainda não possui avaliações."
    );

    return;
  }


  const latest =
    evaluations[
      evaluations.length - 1
    ];


  resultContent.innerHTML = `

    <div
      class="result-section"
    >

      <h3>
        ${escapeHTML(
          relation.name
        )}
      </h3>

      <p>
        ${evaluations.length}
        avaliação${
          evaluations.length === 1
            ? ""
            : "ões"
        }
        registrada${
          evaluations.length === 1
            ? ""
            : "s"
        }.
      </p>

    </div>


    <div
      class="history"
    >

      ${evaluations
        .slice()
        .reverse()
        .map(
          (evaluation, index) => {

            const a =
              evaluation.answers;


            return `

              <div
                class="history-item"
              >

                <strong>
                  ${formatDateTime(
                    evaluation.date
                  )}
                </strong>


                Importância:
                ${a.importance}/10
                ·

                Desgaste:
                ${a.wear}/10
                ·

                Valores:
                ${a.values}/10
                ·

                Confiança:
                ${a.trust}/10
                ·

                Limites:
                ${a.boundaries}/10
                ·

                Convivência:
                ${a.coexistence}/10

              </div>

            `;
          }
        )
        .join("")}

    </div>


    <div
      class="reflection-box"
    >

      O histórico permite observar como
      suas percepções mudam ao longo do tempo.

      <br>
      <br>

      Uma mudança em uma avaliação não significa
      necessariamente que a relação mudou de forma
      objetiva; ela registra como você percebeu
      aquela relação naquele momento.

    </div>

  `;


  resultModal.classList.remove(
    "hidden"
  );
}


/* =====================================================
   FECHAR MODAIS
===================================================== */

document
  .getElementById(
    "closeRelationModal"
  )
  .addEventListener(
    "click",
    closeRelationModal
  );


document
  .getElementById(
    "cancelRelationButton"
  )
  .addEventListener(
    "click",
    closeRelationModal
  );


document
  .getElementById(
    "closeEvaluationModal"
  )
  .addEventListener(
    "click",
    closeEvaluationModal
  );


document
  .getElementById(
    "cancelEvaluationButton"
  )
  .addEventListener(
    "click",
    closeEvaluationModal
  );


document
  .getElementById(
    "closeResultModal"
  )
  .addEventListener(
    "click",
    closeResultModal
  );


function closeEvaluationModal() {

  evaluationModal.classList.add(
    "hidden"
  );

  currentEvaluationRelationId =
    null;
}


function closeResultModal() {

  resultModal.classList.add(
    "hidden"
  );
}


/* =====================================================
   OVERLAYS DOS MODAIS
===================================================== */

document
  .querySelectorAll(
    ".modal-overlay"
  )
  .forEach(
    overlay => {

      overlay.addEventListener(
        "click",
        () => {

          const modal =
            overlay.closest(
              ".modal"
            );


          if (modal) {

            modal.classList.add(
              "hidden"
            );

          }

        }
      );

    }
  );


/* =====================================================
   NOVA RELAÇÃO
===================================================== */

document
  .getElementById(
    "newRelationButton"
  )
  .addEventListener(
    "click",
    () => {

      openRelationModal();

    }
  );


/* =====================================================
   NAVEGAÇÃO
===================================================== */

document
  .querySelectorAll(
    ".nav-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const screen =
            button.dataset.screen;


          document
            .querySelectorAll(
              ".nav-button"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          document
            .querySelectorAll(
              ".screen"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          const target =
            document.getElementById(
              `${screen}Screen`
            );


          if (target) {

            target.classList.add(
              "active"
            );

          }

        }
      );

    }
  );


/* =====================================================
   EXPORTAR JSON
===================================================== */

document
  .getElementById(
    "exportButton"
  )
  .addEventListener(
    "click",
    exportData
  );


function exportData() {

  const data = {

    version:
      DATA_VERSION,

    exportedAt:
      new Date().toISOString(),

    relations

  };


  const json =
    JSON.stringify(
      data,
      null,
      2
    );


  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  const date =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  link.href =
    url;


  link.download =
    `relacoes-backup-${date}.json`;


  document
    .body
    .appendChild(
      link
    );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );
}


/* =====================================================
   IMPORTAR JSON
===================================================== */

document
  .getElementById(
    "importButton"
  )
  .addEventListener(
    "click",
    () => {

      importFile.click();

    }
  );


importFile.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];


    if (!file) {
      return;
    }


    importData(
      file
    );


    event.target.value =
      "";
  }
);


function importData(file) {

  const reader =
    new FileReader();


  reader.onload =
    event => {

      try {

        const data =
          JSON.parse(
            event.target.result
          );


        if (
          !data ||
          !Array.isArray(
            data.relations
          )
        ) {

          throw new Error(
            "Formato inválido."
          );
        }


        const confirmed =
          confirm(
            "Importar este arquivo substituirá os dados atuais deste navegador.\n\n" +
            "Deseja continuar?"
          );


        if (!confirmed) {
          return;
        }


        relations =
          data.relations;


        saveRelations();

        renderRelations();


        alert(
          "Dados importados com sucesso."
        );

      } catch (error) {

        console.error(
          "Erro ao importar:",
          error
        );


        alert(
          "Não foi possível importar o arquivo.\n\n" +
          "Verifique se ele é um backup JSON válido."
        );
      }

    };


  reader.onerror =
    () => {

      alert(
        "Não foi possível ler o arquivo."
      );

    };


  reader.readAsText(
    file
  );
}


/* =====================================================
   APAGAR TODOS OS DADOS
===================================================== */

document
  .getElementById(
    "clearDataButton"
  )
  .addEventListener(
    "click",
    clearAllData
  );


function clearAllData() {

  if (!relations.length) {

    alert(
      "Não existem dados para apagar."
    );

    return;
  }


  const firstConfirmation =
    confirm(
      "ATENÇÃO\n\n" +
      "Isso apagará todas as relações e avaliações deste navegador.\n\n" +
      "Recomendamos exportar um backup JSON antes de continuar.\n\n" +
      "Deseja continuar?"
    );


  if (!firstConfirmation) {
    return;
  }


  const secondConfirmation =
    confirm(
      "Tem certeza que deseja apagar TODOS os dados?"
    );


  if (!secondConfirmation) {
    return;
  }


  relations = [];


  localStorage.removeItem(
    STORAGE_KEY
  );


  renderRelations();


  alert(
    "Todos os dados foram apagados."
  );
}


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !== "Escape"
    ) {
      return;
    }


    if (
      !relationModal.classList.contains(
        "hidden"
      )
    ) {

      closeRelationModal();

    }


    if (
      !evaluationModal.classList.contains(
        "hidden"
      )
    ) {

      closeEvaluationModal();

    }


    if (
      !resultModal.classList.contains(
        "hidden"
      )
    ) {

      closeResultModal();

    }

  }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

renderRelations();