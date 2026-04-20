document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const interes = document.getElementById('interes') ? document.getElementById('interes').value : "Cine Club";
            
            // 1. Enviar Lead al CRM Profesional (Sincronización Real)
            const leadData = { 
                nombre, 
                whatsapp, 
                interes,
                fecha: new Date().toLocaleString(),
                origen: "Cine Club Web" 
            };

            fetch('https://weighted-media-rooms-lips.trycloudflare.com/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            })
            .then(response => console.log("Sincronización con CRM iniciada..."))
            .catch(error => console.error("Error al conectar con CRM:", error));

            // 2. Feedback Visual
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "🚀 PROCESANDO...";
            btn.disabled = true;

            // 3. Redirección a WhatsApp después de una breve animación
            setTimeout(() => {
                let mensaje = `Hola, mi nombre es *${nombre}*. Me acabo de unir al *CINE CLUB PREMIER* y quiero mi membresía Élite.`;
                if(interes === "Reseller") {
                    mensaje = `Hola, mi nombre es *${nombre}*. Me interesa ser *RESELLER* y solicitar las herramientas profesionales.`;
                }
                const whatsappUrl = `https://wa.me/584242948338?text=${encodeURIComponent(mensaje)}`;
                
                // Abrir WhatsApp
                window.open(whatsappUrl, '_blank');
                
                // Resetear Formulario
                btn.innerText = "✅ ¡ENVIADO!";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    if(document.getElementById('interes')) document.getElementById('interes').value = "Cine Club"; 
                    leadForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // --- MANEJO DE CONSULTAS DE SOPORTE ---
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                nombre: document.getElementById('sup_nombre').value,
                whatsapp: document.getElementById('sup_whatsapp').value,
                mensaje: document.getElementById('sup_mensaje').value,
                interes: 'Soporte',
                tipo: 'soporte',
                fecha: new Date().toLocaleString(),
                origen: 'Web Centro Ayuda'
            };

            const submitBtn = supportForm.querySelector('button');
            submitBtn.innerText = '🚢 Enviando Consulta...';

            try {
                const response = await fetch('https://weighted-media-rooms-lips.trycloudflare.com/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('✅ Tu consulta ha sido enviada al CRM. Un asesor te contactará en breve.');
                    supportForm.reset();
                } else {
                    alert('❌ Error al conectar con el CRM. Asegúrate de que esté abierto.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ El CRM no está respondiendo. Por favor, ábrelo en tu computadora.');
            } finally {
                submitBtn.innerText = 'Enviar Consulta al CRM';
            }
        });
    }

    // Función para manejar el botón de Reseller
    window.solicitarReseller = function() {
        const interesInput = document.getElementById('interes');
        if(interesInput) interesInput.value = "Reseller";
        
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        
        // Foco en nombre después del scroll
        setTimeout(() => {
            const nombreInput = document.getElementById('nombre');
            if(nombreInput) nombreInput.focus();
        }, 800);
    }

    // Animación de despliegue al hacer scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});
