(function () {
  const form = document.getElementById("contact-form");
  const result = document.getElementById("result");
  const sendContactMessage = document.getElementById("sendContactMessage");

  if (!form || !result || !sendContactMessage) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    sendContactMessage.style.display = "none";
    result.style.display = "inline-block";
    result.className = "form-status-badge loading";
    result.innerHTML = '<i class="lni lni-reload"></i> Enviando mensaje...';

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    })
      .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status === 200) {
          result.className = "form-status-badge success";
          result.innerHTML = '<i class="lni lni-checkmark-circle"></i> Mensaje enviado con éxito';
          form.reset();
        } else {
          result.className = "form-status-badge error";
          result.innerHTML = jsonResponse.message || '<i class="lni lni-cross-circle"></i> Hubo un error, inténtalo nuevamente';
        }
      })
      .catch((error) => {
        result.className = "form-status-badge error";
        result.innerHTML = '<i class="lni lni-cross-circle"></i> Hubo un error, inténtalo nuevamente';
      })
      .finally(() => {
        setTimeout(() => {
          result.style.display = "none";
          result.className = "form-status-badge";
          result.innerHTML = "";
          sendContactMessage.style.display = "inline-block";
        }, 6000);
      });
  });
})();
