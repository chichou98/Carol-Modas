// Em assets/js/utils/modals.js

/**
 * Cria e exibe um modal de ALERTA customizado (apenas com botão OK).
 * Retorna uma Promise que resolve quando o usuário clica em OK ou fecha o modal.
 * @param {string} message A mensagem a ser exibida no modal.
 * @returns {Promise<void>}
 */
export function customAlert(message) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        overlay.innerHTML = `
            <div class="confirm-modal">
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn-ok">OK</button>
                </div>
            </div>
        `;

        const btnOk = overlay.querySelector('.confirm-btn-ok');

        const cleanupAndResolve = () => {
            document.body.removeChild(overlay);
            resolve();
        };

        btnOk.addEventListener('click', cleanupAndResolve);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cleanupAndResolve();
            }
        });

        document.body.appendChild(overlay);
    });
}


/**
 * Cria e exibe um modal de CONFIRMAÇÃO customizado (com OK e Cancelar).
 * Retorna uma Promise que resolve para `true` se OK, e `false` se Cancelar.
 * @param {string} message A mensagem a ser exibida no modal.
 * @returns {Promise<boolean>}
 */
export function customConfirm(message) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        overlay.innerHTML = `
            <div class="confirm-modal">
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn-cancel">Cancelar</button>
                    <button class="confirm-btn-ok">OK</button>
                </div>
            </div>
        `;

        const btnOk = overlay.querySelector('.confirm-btn-ok');
        const btnCancel = overlay.querySelector('.confirm-btn-cancel');

        const cleanupAndResolve = (value) => {
            document.body.removeChild(overlay);
            resolve(value);
        };

        btnOk.addEventListener('click', () => cleanupAndResolve(true));
        btnCancel.addEventListener('click', () => cleanupAndResolve(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cleanupAndResolve(false);
            }
        });

        document.body.appendChild(overlay);
    });
}
