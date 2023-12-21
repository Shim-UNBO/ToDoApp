document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("todoModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.getElementById("closeModal");
    const saveTodoBtn = document.getElementById("saveTodo");
    const todoText = document.getElementById("todoText");
    let seq = parseInt(localStorage.getItem('seq') || 0); 
    const todoListContainer = document.getElementById("todoListContainer");

    //모달에 저장 버튼 클릭 시 함수
    saveTodoBtn.onclick = function() {
        const todoValue = todoText.value.trim();
        if (todoValue) {
            addTodoToList(todoValue, seq);
            localStorage.setItem(`todo-${seq}`, todoValue);
            localStorage.setItem(`checked-${seq}`, 'false');
            seq++;
            localStorage.setItem('seq', seq);
        }
        modal.style.display = "none";
        todoText.value = '';
        sortTodos();
    }

    //todo 리스트 생성 시 함수
    function addTodoToList(todo, seq,load=false) {

        console.log("add - "+todo)
        const todoItem = document.createElement("div");
        todoItem.classList.add("todoItem");
      
        // 체크박스 추가
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${seq}`;
        checkbox.onchange = function() {
            textSpan.style.textDecoration = this.checked ? "line-through" : "none";
            localStorage.setItem(`checked-${seq}`, this.checked.toString());
            sortTodos();
        };
        todoItem.appendChild(checkbox);

        // 할 일 텍스트
        const textSpan = document.createElement("span");
        textSpan.textContent = `${seq}: ${todo} `;
        todoItem.appendChild(textSpan);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("todoButtons");
        // 삭제 버튼 추가
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.onclick = function() {
            localStorage.removeItem(`todo-${seq}`);
            todoItem.remove();
        };
        buttonContainer.appendChild(deleteBtn);

        // 수정 버튼 추가
        const editBtn = document.createElement("button");
        editBtn.textContent = "수정";
        editBtn.onclick = function() {
            const newTodo = prompt("할 일 수정:", todo);
            if (newTodo !== null) {
                todoItem.innerHTML = `${seq}: ${newTodo} `;
                todoItem.appendChild(deleteBtn);
                todoItem.appendChild(editBtn);
                localStorage.setItem(`todo-${seq}`, newTodo);
            }
        };
        buttonContainer.appendChild(editBtn);

        todoItem.appendChild(buttonContainer);
        todoListContainer.appendChild(todoItem);
        //새로고침 시 체크박스 유지
        if (load) {
            const checked = localStorage.getItem(`checked-${seq}`) === 'true';
            checkbox.checked = checked;
            textSpan.style.textDecoration = checked ? "line-through" : "none";
            sortTodos();
        }
        
    }

    //모달 열기
    openModalBtn.onclick = function() {
        modal.style.display = "block";
    }

    //모달 닫기 버튼
    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    }

    //빈화면 클릭시 모달 닫기
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //새로고침시 아이템 리스트 불러오기
    function loadTodos() {
        for (let i = 0; i <= seq; i++) {
            const todoDataStr = localStorage.getItem(`todo-${i}`);
            if (todoDataStr) {
                console.log(typeof todoDataStr)
                // const { todo } = JSON.parse(todoDataStr);
                    addTodoToList(todoDataStr, i, true);
                
            }
        }
    }
    //체크 한 todo는 밑으로 정렬
    function sortTodos() {
        const items = Array.from(todoListContainer.children);
        items.sort((a, b) => {
            const aChecked = a.querySelector("input[type='checkbox']").checked;
            const bChecked = b.querySelector("input[type='checkbox']").checked;
            return aChecked - bChecked;
        });
        items.forEach(item => todoListContainer.appendChild(item));
    }

    
    loadTodos();

    
});