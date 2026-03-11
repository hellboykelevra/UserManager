// CONFIGURACIÓN API
        const API_URL = 'backend/api.php';
        
        let useMockDB = false;
        
        // Elementos del DOM
        const form = id('userForm');
        const btnCancel = id('btnCancel');
        const formTitle = id('formTitle');
        const tbody = id('usersTableBody');
        
        function id(elementId) { return document.getElementById(elementId); }

        document.addEventListener('DOMContentLoaded', () => {
            loadUsers();
        });

        // ==========================================
        //  LÓGICA DE DB / API (HÍBRIDA)
        // ==========================================

        async function apiCall(action, method = 'GET', data = null) {
            if (useMockDB) return mockApiCall(action, method, data);

            try {
                const options = { method };
                if (data) {
                    options.headers = { 'Content-Type': 'application/json' };
                    options.body = JSON.stringify(data);
                }
                
                const response = await fetch(`${API_URL}?action=${action}`, options);
                if (!response.ok) throw new Error('Servidor no encontrado');
                
                return await response.json();
            } catch (error) {
                if (!useMockDB) {
                    useMockDB = true;
                    return mockApiCall(action, method, data);
                }
                throw error;
            }
        }

        async function loadUsers() {
            tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">Cargando datos...</td></tr>';
            try {
                const response = await apiCall('read');
                if (response.success) {
                    renderTable(response.data);
                } else {
                    showToast(response.message || 'Error al cargar usuarios', 'error');
                }
            } catch (error) {
                showToast('Error de conexión', 'error');
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userId = id('userId').value;
            const userData = {
                nombre: id('nombre').value.trim(),
                apellido1: id('apellido1').value.trim(),
                apellido2: id('apellido2').value.trim(),
                dni: id('dni').value.trim(),
                correo: id('correo').value.trim()
            };

            const action = userId ? 'update' : 'create';
            if (userId) userData.id = userId;

            try {
                const response = await apiCall(action, 'POST', userData);
                if (response.success) {
                    showToast(userId ? 'Usuario actualizado correctamente' : 'Usuario registrado correctamente', 'success');
                    resetForm();
                    loadUsers();
                } else {
                    showToast(response.message || 'Error al guardar los datos', 'error');
                }
            } catch (error) {
                showToast('Error de conexión al guardar', 'error');
            }
        });

        async function deleteUser(id) {
            try {
                const response = await apiCall('delete', 'POST', { id: id });
                if (response.success) {
                    showToast('Usuario eliminado', 'success');
                    loadUsers();
                } else {
                    showToast(response.message || 'Error al eliminar', 'error');
                }
            } catch (error) {
                showToast('Error de conexión al eliminar', 'error');
            }
        }

        function editUser(userString) {
            const user = JSON.parse(decodeURIComponent(userString));
            
            id('userId').value = user.id;
            id('nombre').value = user.nombre;
            id('apellido1').value = user.apellido1;
            id('apellido2').value = user.apellido2 || '';
            id('dni').value = user.dni;
            id('correo').value = user.correo;
            
            formTitle.textContent = "Editar Usuario";
            btnCancel.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        btnCancel.addEventListener('click', resetForm);

        function resetForm() {
            form.reset();
            id('userId').value = '';
            formTitle.textContent = "Nuevo Usuario";
            btnCancel.classList.add('hidden');
        }

        function renderTable(users) {
            tbody.innerHTML = '';
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500 bg-gray-50">No hay usuarios registrados en la base de datos.</td></tr>';
                return;
            }

            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-gray-50 border-b transition-colors";
                
                const userJSON = encodeURIComponent(JSON.stringify(user));
                
                tr.innerHTML = `
                    <td class="p-3">
                        <div class="font-medium text-gray-800">${user.nombre}</div>
                        <div class="text-xs text-gray-500">${user.apellido1} ${user.apellido2 || ''}</div>
                    </td>
                    <td class="p-3 text-gray-600">${user.dni}</td>
                    <td class="p-3 text-gray-600">${user.correo}</td>
                    <td class="p-3 text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="editUser('${userJSON}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Editar">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button onclick="deleteUser(${user.id})" class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function showToast(message, type) {
            const toast = id('toast');
            toast.textContent = message;
            toast.className = `toast toast-${type} show`;
            setTimeout(() => { toast.classList.remove('show'); }, 3000);
        }

        function mockApiCall(action, method, data) {
            return new Promise((resolve) => {
                let users = JSON.parse(localStorage.getItem('mock_usuarios_db')) || [];
                let response = { success: true };

                setTimeout(() => {
                    if (action === 'read') {
                        response.data = users.sort((a, b) => b.id - a.id);
                    } 
                    else if (action === 'create') {
                        if(users.some(u => u.dni === data.dni)) {
                            resolve({ success: false, message: 'El DNI ya está registrado.' }); return;
                        }
                        data.id = Date.now();
                        users.push(data);
                        localStorage.setItem('mock_usuarios_db', JSON.stringify(users));
                    } 
                    else if (action === 'update') {
                        if(users.some(u => u.dni === data.dni && u.id != data.id)) {
                            resolve({ success: false, message: 'El DNI ya pertenece a otro usuario.' }); return;
                        }
                        users = users.map(u => u.id == data.id ? data : u);
                        localStorage.setItem('mock_usuarios_db', JSON.stringify(users));
                    } 
                    else if (action === 'delete') {
                        users = users.filter(u => u.id != data.id);
                        localStorage.setItem('mock_usuarios_db', JSON.stringify(users));
                    }
                    resolve(response);
                }, 300);
            });
        }