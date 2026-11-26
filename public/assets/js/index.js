const mp = new MercadoPago('TEST-085e5a8c-5bde-4e9f-b786-09fb68ee66dd', {
  locale: 'es-CL'
});

const bricksBuilder = mp.bricks();
const renderCardPaymentBrick = async (bricksBuilder) => {
  const settings = {
    initialization: {
      amount: 100, // monto a ser pago
      payer: {
        email: "",
      },
    },
    customization: {
      visual: {
        style: {
          customVariables: {
            theme: 'default', // | 'dark' | 'bootstrap' | 'flat'
          }
        }
      },
      paymentMethods: {
        maxInstallments: 1,
      }
    },
    callbacks: {
      onReady: () => {
        // callback llamado cuando Brick esté listo
      },
      onSubmit: async (cardFormData) => {

        cardFormData.transaction_amount = parseInt(document.getElementById("paymentValueInput").value);

        let paymentPending = await fetch("/process_payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cardFormData)
        });
        let serverResponse = await paymentPending.json();
        if (serverResponse === 'approved') {
          document.getElementById("cardPaymentBrick_container").style.display = "none";
          document.getElementById("paymentValueForm").style.display = "none";
          document.getElementById("successPaymentDiv").style.display = "block";
        }
      },
      onError: (error) => {
        document.getElementById("cardPaymentBrick_container").style.display = "none";
        document.getElementById("paymentValueForm").style.display = "none";
        document.getElementById("errorPaymentDiv").style.display = "block";
      },
    },
  };
  window.cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
};

setTimeout(() => {
  if (document.getElementById('cardPaymentBrick_container') && document.getElementById('meliReserveDiv')) {
    renderCardPaymentBrick(bricksBuilder);
  }
}, 1500);


//   document.getElementById('sendContactMessage').addEventListener('click', async () => {
//     event.preventDefault();
//     let contactName = document.getElementById('contactName').value;
//     let contactEmail = document.getElementById('contactEmail').value;
//     let contactMessage = document.getElementById('contactMessage').value;

//     let message = {
//         name: contactName,
//         email: contactEmail,
//         message: contactMessage,
//     };

//     if (Object.values(message).every(val => val.length > 0)) {

//         let sendMessage = await fetch("/sendMessage", {
//             method: "POST",
//             headers: { "Content-Type": "application/json", },
//             body: JSON.stringify(message)
//           });

//         let serverResponse = await sendMessage.json(); 
//     }
// });

document.getElementById("closeButton").addEventListener("click", function () {
  document.querySelector(".fixed-box").style.display = "none";
});

function downloadPDF() {
  const rutaImagen = '/assets/images/files/brochure2.pdf';

  const enlaceTemporal = document.createElement('a');
  enlaceTemporal.href = rutaImagen;
  enlaceTemporal.download = 'Brochure'; // Puedes cambiar el nombre de la descarga
  enlaceTemporal.target = '_blank';

  document.body.appendChild(enlaceTemporal);

  // Simula un clic en el enlace temporal para iniciar la descarga
  enlaceTemporal.click();

  // Elimina el enlace temporal del DOM
  document.body.removeChild(enlaceTemporal);
}
async function indicators() {
  try {
    let serverRequest = await fetch('https://mindicador.cl/api');
    if (!serverRequest.ok) {
      throw new Error(`HTTP error! status: ${serverRequest.status}`);
    }
    let serverResponse = await serverRequest.json();
    let codes = ['dolar', 'euro', 'imacec', 'ipc', 'uf', 'utm'];
    let data = Object.values(serverResponse).filter(a => a && codes.includes(a.codigo)).map(a => {
      return { Nombre: a.codigo, Valor: a.valor }
    });
    const tickerList = document.getElementById('ticker-list');
    if (tickerList) {
      tickerList.innerHTML = '';
      data.forEach(dato => {
        const listItem = document.createElement('li');
        listItem.textContent = `${dato.Nombre.toUpperCase()}: ${dato.Valor}`;
        tickerList.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Error cargando los indicadores económicos:", error);
    const tickerContainer = document.querySelector('.ticker-container');
    if (tickerContainer) {
      tickerContainer.style.display = 'none';
    }
  }
}
indicators();

const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
const meliReserveDiv = document.querySelector('#meliReserveDiv');

navbarToggler.addEventListener('click', function () {
  if (meliReserveDiv) {
    if (!navbarCollapse.classList.contains('show')) {
      meliReserveDiv.style.display = 'none';
    }
    else {
      meliReserveDiv.style.display = 'block';
    }
  }
});


// Agregar eventos para mostrar/ocultar el botón según el estado del menú
// navbarCollapse.addEventListener('shown.bs.collapse', function () {
//   console.log('si')
// });