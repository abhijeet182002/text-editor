        // Editor State
        let editorState = {
            content: '',
            history: [''],
            historyIndex: 0,
            fontSize: '14',
            fontFamily: 'Arial',
            textColor: '#000000',
            backgroundColor: '#ffffff',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            textAlign: 'left'
        };

        // Color Palettes
        const standardColors = [
            '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef',
            '#f3f3f3', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
            '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc',
            '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc', '#dd7e6b', '#ea9999',
            '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
            '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc',
            '#8e7cc3', '#c27ba0', '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e',
            '#3c78d8', '#3d85c6', '#674ea7', '#a64d79', '#85200c', '#990000', '#b45f06', '#bf9000',
            '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47', '#5b0f00', '#660000',
            '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
        ];

        const backgroundColors = [
            '#ffffff', '#f8f9fa', '#f1f3f4', '#e8eaed', '#dadce0', '#bdc1c6', '#9aa0a6', '#5f6368',
            '#3c4043', '#202124', '#fef7e0', '#fef7e0', '#fce8e6', '#fde7f3', '#e8f0fe', '#e6f4ea',
            '#fff3e0', '#f3e5f5', '#e1f5fe', '#e0f2f1', '#fff8e1', '#fce4ec', '#e8eaf6', '#f1f8e9',
            '#fff9c4', '#f8bbd9', '#c8e6c9', '#ffecb3', '#d1c4e9', '#b2dfdb', '#ffccbc', '#f8bbd9',
            '#ffcdd2', '#f8bbd9', '#dcedc8', '#ffe0b2', '#d7ccc8', '#ffab91', '#bcaaa4', '#ffcc80'
        ];

        const gradientColors = [
            'linear-gradient(45deg, #ff6b6b, #feca57)',
            'linear-gradient(45deg, #48cae4, #023e8a)',
            'linear-gradient(45deg, #06ffa5, #0077b6)',
            'linear-gradient(45deg, #f72585, #b5179e)',
            'linear-gradient(45deg, #f77f00, #fcbf49)',
            'linear-gradient(45deg, #7209b7, #560bad)',
            'linear-gradient(45deg, #f72585, #4361ee)',
            'linear-gradient(45deg, #06ffa5, #7209b7)',
            'linear-gradient(45deg, #ffbe0b, #fb8500)',
            'linear-gradient(45deg, #8ecae6, #219ebc)',
            'linear-gradient(45deg, #ffd60a, #003566)',
            'linear-gradient(45deg, #ff006e, #8338ec)'
        ];

        // Recent colors storage
        let recentTextColors = JSON.parse(localStorage.getItem('recentTextColors') || '[]');
        let recentBackgroundColors = JSON.parse(localStorage.getItem('recentBackgroundColors') || '[]');

        // Initialize editor
        function initEditor() {
            updateTextAreaStyle();
            updateButtonStates();
            createColorPickers();
            updateStats();

            // Close color pickers when clicking outside
            document.addEventListener('click', function (e) {
                if (!e.target.closest('.color-picker-container')) {
                    document.querySelectorAll('.color-picker-dropdown').forEach(dropdown => {
                        dropdown.classList.remove('show');
                    });
                }
            });
        }

        // Create color pickers
        function createColorPickers() {
            createColorPicker('textColorPicker', 'text');
            createColorPicker('backgroundColorPicker', 'background');
        }

        function createColorPicker(containerId, type) {
            const container = document.getElementById(containerId);
            const colors = type === 'text' ? standardColors : backgroundColors;

            let html = `
                <div class="color-section">
                    <div class="color-section-title">Standard Colors</div>
                    <div class="color-grid" id="${type}StandardGrid">
            `;

            colors.forEach(color => {
                html += `<div class="color-option" style="background-color: ${color}" onclick="selectColor('${type}', '${color}')" title="${color}"></div>`;
            });

            html += `</div></div>`;

            if (type === 'background') {
                html += `
                    <div class="color-section">
                        <div class="color-section-title">Gradient Backgrounds</div>
                        <div class="color-grid large">
                `;

                gradientColors.forEach(gradient => {
                    html += `<div class="gradient-option" style="background: ${gradient}" onclick="selectColor('${type}', '${gradient}')" title="${gradient}"></div>`;
                });

                html += `</div></div>`;
            }

            html += `
                <div class="color-section">
                    <div class="color-section-title">Recent Colors</div>
                    <div class="recent-colors" id="${type}RecentColors"></div>
                </div>
                
                <div class="custom-color-section">
                    <div class="color-section-title">Custom Color</div>
                    <input type="color" class="custom-color-input" id="${type}CustomPicker" onchange="selectCustomColor('${type}', this.value)">
                    <div class="color-input-group">
                        <input type="text" placeholder="#000000" id="${type}HexInput" maxlength="7">
                        <button onclick="applyHexColor('${type}')" style="padding: 4px 8px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Apply</button>
                    </div>
                    ${type === 'background' ? `
                    <div class="color-input-group">
                        <label style="font-size: 12px;">Opacity:</label>
                        <input type="range" class="opacity-slider" id="${type}OpacitySlider" min="0" max="100" value="100" onchange="updateOpacity('${type}', this.value)">
                        <span id="${type}OpacityValue">100%</span>
                    </div>
                    ` : ''}
                    <div class="color-preview" id="${type}ColorPreview"></div>
                </div>
            `;

            container.innerHTML = html;
            updateRecentColors(type);
        }

        // Toggle color picker
        function toggleColorPicker(type) {
            const pickerId = type === 'textColor' ? 'textColorPicker' : 'backgroundColorPicker';
            const picker = document.getElementById(pickerId);

            // Close other pickers
            document.querySelectorAll('.color-picker-dropdown').forEach(dropdown => {
                if (dropdown.id !== pickerId) {
                    dropdown.classList.remove('show');
                }
            });

            picker.classList.toggle('show');
            alert("hj");
        }

        // Select color
        function selectColor(type, color) {
            if (type === 'text') {
                editorState.textColor = color;
                document.getElementById('textColorIcon').style.color = color.includes('gradient') ? '#000' : color;
                document.getElementById('textColorPicker').classList.remove('show');
            } else {
                editorState.backgroundColor = color;
                document.getElementById('backgroundColorPicker').classList.remove('show');
            }

            updateTextAreaStyle();
            addToRecentColors(type, color);
        }

        // Select custom color
        function selectCustomColor(type, color) {
            document.getElementById(`${type}HexInput`).value = color;
            document.getElementById(`${type}ColorPreview`).style.backgroundColor = color;
            selectColor(type, color);
        }

        // Apply hex color
        function applyHexColor(type) {
            const hexValue = document.getElementById(`${type}HexInput`).value;
            if (hexValue.match(/^#[0-9A-F]{6}$/i)) {
                selectColor(type, hexValue);
            } else {
                alert('Please enter a valid hex color (e.g., #FF0000)');
            }
        }

        // Update opacity
        function updateOpacity(type, opacity) {
            document.getElementById(`${type}OpacityValue`).textContent = opacity + '%';
            const baseColor = document.getElementById(`${type}CustomPicker`).value;
            const rgbaColor = hexToRgba(baseColor, opacity / 100);
            document.getElementById(`${type}ColorPreview`).style.backgroundColor = rgbaColor;
        }

        // Convert hex to rgba
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        // Add to recent colors
        function addToRecentColors(type, color) {
            const recentColors = type === 'text' ? recentTextColors : recentBackgroundColors;

            const index = recentColors.indexOf(color);
            if (index > -1) {
                recentColors.splice(index, 1);
            }

            recentColors.unshift(color);

            if (recentColors.length > 10) {
                recentColors.pop();
            }

            if (type === 'text') {
                recentTextColors = recentColors;
                localStorage.setItem('recentTextColors', JSON.stringify(recentColors));
            } else {
                recentBackgroundColors = recentColors;
                localStorage.setItem('recentBackgroundColors', JSON.stringify(recentColors));
            }

            updateRecentColors(type);
        }

        // Update recent colors display
        function updateRecentColors(type) {
            const container = document.getElementById(`${type}RecentColors`);
            const recentColors = type === 'text' ? recentTextColors : recentBackgroundColors;

            container.innerHTML = '';
            recentColors.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'recent-color';
                colorDiv.style.background = color;
                colorDiv.title = color;
                colorDiv.onclick = () => selectColor(type, color);
                container.appendChild(colorDiv);
            });
        }

        // Text change handler
        function handleTextChange() {
            const textArea = document.getElementById('textArea');
            const newContent = textArea.value;

            if (newContent !== editorState.content) {
                editorState.content = newContent;
                addToHistory(newContent);
                updateStats();
                updateButtonStates();
            }
        }

        // History management
        function addToHistory(content) {
            const newHistory = editorState.history.slice(0, editorState.historyIndex + 1);
            newHistory.push(content);
            editorState.history = newHistory;
            editorState.historyIndex = newHistory.length - 1;
        }

        // Undo functionality
        function handleUndo() {
            if (editorState.historyIndex > 0) {
                editorState.historyIndex--;
                editorState.content = editorState.history[editorState.historyIndex];
                document.getElementById('textArea').value = editorState.content;
                updateStats();
                updateButtonStates();
            }
        }

        // Redo functionality
        function handleRedo() {
            if (editorState.historyIndex < editorState.history.length - 1) {
                editorState.historyIndex++;
                editorState.content = editorState.history[editorState.historyIndex];
                document.getElementById('textArea').value = editorState.content;
                updateStats();
                updateButtonStates();
            }
        }

        // Font family change
        function handleFontFamilyChange() {
            const fontFamily = document.getElementById('fontFamily').value;
            editorState.fontFamily = fontFamily;
            updateTextAreaStyle();
        }

        // Font size change
        function handleFontSizeChange() {
            const fontSize = document.getElementById('fontSize').value;
            editorState.fontSize = fontSize;
            updateTextAreaStyle();
        }

        // Toggle text formatting
        function toggleFormat(format) {
            switch (format) {
                case 'bold':
                    editorState.isBold = !editorState.isBold;
                    break;
                case 'italic':
                    editorState.isItalic = !editorState.isItalic;
                    break;
                case 'underline':
                    editorState.isUnderline = !editorState.isUnderline;
                    break;
            }
            updateTextAreaStyle();
            updateButtonStates();
        }

        //showing file bar
        function MenuClick() {
            const menu = document.getElementsByClassName('file-menu')[0];
            if (menu.style.display == "block") {
                menu.style.display = "none";
            }
            else {
                menu.style.display = "block";
            }
        }
        //showing edit bar
        function MenuClick2() {
            const menu = document.getElementsByClassName('file-menu')[1];
            if (menu.style.display == "block") {
                menu.style.display = "none";
            }
            else {
                menu.style.display = "block";
            }
        }
        // showing insert bar
        function MenuClick3() {
            const menu = document.getElementsByClassName('file-menu')[2];
            if (menu.style.display == "block") {
                menu.style.display = "none";
            }
            else {
                menu.style.display = "block";
            }
        }
        function MenuClick5() {
            const menu = document.getElementsByClassName('file-menu')[3];
            if (menu.style.display == "block") {
                menu.style.display = "none";
            }
            else {
                menu.style.display = "block";
            }
        }
        function showfont(){
            const show=document.getElementsByClassName('fomenu')[0];
            if(show.style.display=="none"){
                show.style.display="block"
            }
            else{
                show.style.display="none"
            }
        }

        //for upload
        function submitText() {
            const text = document.getElementById("textArea").value;
            console.log(text);
        }

        // Set text alignment
        function setAlignment(align) {
            editorState.textAlign = align;
            updateTextAreaStyle();
            updateButtonStates();
        }

        // Update textarea styling
        function updateTextAreaStyle() {
            const textArea = document.getElementById('textArea');
            textArea.style.fontSize = editorState.fontSize + 'px';
            textArea.style.fontFamily = editorState.fontFamily;
            textArea.style.color = editorState.textColor;

            // Handle gradient backgrounds
            if (editorState.backgroundColor.includes('gradient')) {
                textArea.style.background = editorState.backgroundColor;
                textArea.style.backgroundColor = 'transparent';
            } else {
                textArea.style.backgroundColor = editorState.backgroundColor;
                textArea.style.background = 'none';
            }

            textArea.style.fontWeight = editorState.isBold ? 'bold' : 'normal';
            textArea.style.fontStyle = editorState.isItalic ? 'italic' : 'normal';
            textArea.style.textDecoration = editorState.isUnderline ? 'underline' : 'none';
            textArea.style.textAlign = editorState.textAlign;
        }

        // Update button states
        function updateButtonStates() {
            // Undo/Redo buttons
            document.getElementById('undoBtn').disabled = editorState.historyIndex <= 0;
            document.getElementById('redoBtn').disabled = editorState.historyIndex >= editorState.history.length - 1;

            // Format buttons
            document.getElementById('boldBtn').classList.toggle('active', editorState.isBold);
            document.getElementById('italicBtn').classList.toggle('active', editorState.isItalic);
            document.getElementById('underlineBtn').classList.toggle('active', editorState.isUnderline);

            // Alignment buttons
            document.querySelectorAll('[id^="align"]').forEach(btn => btn.classList.remove('active'));
            document.getElementById('align' + editorState.textAlign.charAt(0).toUpperCase() + editorState.textAlign.slice(1) + 'Btn').classList.add('active');
        }

        // Update character and word count
        function updateStats() {
            const content = editorState.content;
            const charCount = content.length;
            const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

            document.getElementById('charCount').textContent = `Characters: ${charCount}`;
            document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
        }


        // Keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            handleRedo();
                        } else {
                            handleUndo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        handleRedo();
                        break;
                    case 'b':
                        e.preventDefault();
                        toggleFormat('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        toggleFormat('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        toggleFormat('underline');
                        break;
                }
            }
        });

        // Initialize when page loads
        window.addEventListener('load', initEditor);

        function insertHorizontalLine() {
            alert("sds");
            const editor = document.getElementById('textArea');

            // Create elements
            const br = document.createElement("br");
            const hr = document.createElement("hr");

            // Append <br> and <hr> at the end
            editor.appendChild(br.cloneNode());
            editor.appendChild(hr);
            editor.appendChild(br.cloneNode());

            // Scroll to bottom after inserting line
            editor.scrollTop = editor.scrollHeight;
        }
        function MenuClick3() {
            const menu = document.querySelector('.file-navbar-3');
            menu.classList.toggle('show-menu');
        }

        function insertHorizontalLine() {
            const editor = document.getElementById('textArea');

            // Create HR and spacing
            const br = document.createElement("br");
            const hr = document.createElement("hr");

            editor.appendChild(br.cloneNode());
            editor.appendChild(hr);
            editor.appendChild(br.cloneNode());

            editor.scrollTop = editor.scrollHeight;
        }
