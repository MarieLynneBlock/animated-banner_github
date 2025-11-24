/**
 * Initializes the DOMContentLoaded event listener to execute the code when the document is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
    const codeWrapper = document.getElementById("codeWrapper");
    const lineHeight = 48; // Высота одной строки (должна совпадать с CSS)
    const visibleLines = 3; // Всегда показываем 3 строки
    let currentTransform = 0;
    let indentLevel = 0;
    
    // Автоматически загружаем список иконок из JSON файла
    let iconLibrary = [];
    try {
        // Пробуем разные пути к JSON файлу
        const jsonPaths = [
            'assets/icons-list.json',
            './assets/icons-list.json',
            '/assets/icons-list.json'
        ];
        
        let loaded = false;
        for (const path of jsonPaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    iconLibrary = await response.json();
                    console.log(`✓ Загружено ${iconLibrary.length} иконок из ${path}:`, iconLibrary);
                    loaded = true;
                    break;
                }
            } catch (e) {
                console.log(`Пробуем другой путь: ${path}`);
            }
        }
        
        if (!loaded) {
            console.warn('Файл icons-list.json не найден. Пробуем загрузить иконки напрямую...');
            iconLibrary = await loadIconsFromDirectory();
        }
    } catch (error) {
        console.warn('Ошибка загрузки списка иконок:', error);
        iconLibrary = await loadIconsFromDirectory();
    }
    
    // Если иконок нет, используем пустой массив
    if (iconLibrary.length === 0) {
        console.warn('Иконки не найдены. Положите PNG или SVG файлы в папку assets/icons/');
    }
    
    /**
     * Пытается загрузить иконки напрямую, проверяя существование файлов
     */
    async function loadIconsFromDirectory() {
        // Список известных иконок из папки assets/icons/
        const knownIcons = [
            { name: 'Python', file: 'python.png' },
            { name: 'Ansible', file: 'ansible.png' },
            { name: 'Terraform', file: 'terraform.png' },
            { name: 'K8s', file: 'k8s.png' },
            { name: 'Code', file: 'code.png' },
            { name: 'Linux', file: 'linux.png' },
            { name: 'Aws', file: 'aws.png' },
            { name: 'Grafana', file: 'grafana.png' },
            { name: 'Prometheus', file: 'prometheus.png' },
            { name: 'Github', file: 'github.png' },
            { name: 'Jenkins', file: 'jenkins.png' },
            { name: 'Logstash', file: 'logstash.png' },
            { name: 'Zabbix', file: 'zabbix.png' },
            { name: 'Pycharm', file: 'pycharm.png' },
            { name: 'Debian', file: 'debian.png' },
            { name: 'Ubuntu', file: 'ubuntu.png' },
        ];
        const foundIcons = [];
        
        for (const icon of knownIcons) {
            const src = `assets/icons/${icon.file}`;
            foundIcons.push({
                name: icon.name,
                src: src,
                type: icon.file.endsWith('.svg') ? 'svg' : 'png'
            });
        }
        
        console.log('Используем fallback список иконок:', foundIcons);
        return foundIcons;
    }

    /**
     * Создает DOM-элемент иконки. Поддерживает PNG и SVG-файлы.
     * @param {{name: string, src: string, type: 'png' | 'svg'}} iconMeta
     * @returns {HTMLElement}
     */
    function createIconElement(iconMeta) {
        const img = document.createElement('img');
        img.className = 'devops-icon';
        img.src = iconMeta.src;
        img.alt = iconMeta.name;
        img.title = iconMeta.name;
        img.loading = 'lazy';
        img.dataset.iconType = iconMeta.type;
        
        // Добавляем обработчики для отладки
        img.onload = function() {
            console.log(`✓ Иконка загружена: ${iconMeta.name} (${iconMeta.src})`);
        };
        img.onerror = function() {
            console.error(`✗ Ошибка загрузки иконки: ${iconMeta.name} (${iconMeta.src})`);
        };
        
        return img;
    }
  
    /**
     * Adds a new line to the code wrapper with random indentation and icon blocks.
     */
    function addLine() {
        if (!iconLibrary.length) return;

        const lineWrapper = document.createElement('div');
        lineWrapper.className = 'code-line-wrapper';
  
        const lineNumber = document.createElement('div');
        lineNumber.className = 'line-number';
  
        const lineContainer = document.createElement('div');
        lineContainer.className = 'line-container';
  
        // Randomly adjust indentation with a maximum of 2 steps (40px)
        if (Math.random() > 0.5) {
            indentLevel += Math.random() > 0.5 ? 20 : -20;
            indentLevel = Math.max(0, Math.min(indentLevel, 40)); // Ensure indent level is between 0 and 40 pixels
        }
        lineContainer.style.marginLeft = `${30 + indentLevel}px`; // Adjust marginLeft based on indent level
  
        // Create icons for the line
        const numberOfIcons = Math.floor(Math.random() * 3) + 5;  // Random number of icons (5-7)
        
        // Создаем копию массива иконок для текущей строки, чтобы не повторялись в одной строке
        const iconsToUse = [...iconLibrary];
  
        for (let i = 0; i < numberOfIcons; i++) {
            // Проверяем, что есть доступные иконки
            if (iconsToUse.length === 0) {
                // Если иконки закончились, перезаполняем массив
                iconsToUse.push(...iconLibrary);
            }
            
            // Выбираем случайную иконку из доступных
            const randomIndex = Math.floor(Math.random() * iconsToUse.length);
            const iconMeta = iconsToUse[randomIndex];
            
            // Удаляем выбранную иконку из доступных, чтобы не повторяться в одной строке
            iconsToUse.splice(randomIndex, 1);
            
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'devops-icon-wrapper';
            
            const icon = createIconElement(iconMeta);
            
            // Устанавливаем стили для отображения
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.display = 'block';
            icon.style.opacity = '0';
            icon.style.transition = 'opacity 0.3s ease-in';
            
            iconWrapper.appendChild(icon);
            lineContainer.appendChild(iconWrapper);
            
            // Плавное появление иконки
            setTimeout(() => {
                if (icon.complete && icon.naturalHeight !== 0) {
                    icon.style.opacity = '1';
                } else {
                    // Если изображение еще загружается, ждем его загрузки
                    icon.onload = function() {
                        icon.style.opacity = '1';
                    };
                }
            }, i * 50);
        }
  
        lineWrapper.appendChild(lineNumber);
        lineWrapper.appendChild(lineContainer);
        codeWrapper.appendChild(lineWrapper);
  
        const totalLines = codeWrapper.children.length;
        
        // Начинаем скролл только когда есть больше строк, чем видно
        // Всегда показываем ровно 3 строки
        if (totalLines > visibleLines) {
            currentTransform -= lineHeight;
            codeWrapper.style.transform = `translateY(${currentTransform}px)`;
        }
  
        // Удаляем первую строку только если строк больше чем нужно для плавного скролла
        // Удаляем когда есть 5+ строк, чтобы после удаления осталось минимум 4 строки
        // Это гарантирует, что всегда будет видно ровно 3 строки
        if (totalLines > visibleLines + 2) {
            codeWrapper.removeChild(codeWrapper.firstChild);
            currentTransform += lineHeight;
            // Убеждаемся, что transform корректный для отображения 3 строк
            codeWrapper.style.transform = `translateY(${currentTransform}px)`;
        }
    }
  
    /**
     * Simulates typing code by adding lines at a specified interval.
     *
     * @param {number} lines - The number of lines to add.
     * @param {number} delay - The delay between adding each line in milliseconds.
     */
    function typeCode(lines, delay) {
        let count = 0;
        const interval = setInterval(() => {
            addLine();
            count++;
            if (count === lines) clearInterval(interval);
        }, delay);
    }
  
    // Запускаем анимацию только после загрузки иконок
    if (iconLibrary.length > 0) {
        console.log('Иконки загружены, запускаем анимацию...');
        // Создаем 30 строк с задержкой 500мс (0.5 сек) между строками ≈ 15 секунд анимации
        typeCode(30, 1000);
    } else {
        console.error('Нет доступных иконок. Положите PNG или SVG файлы в папку assets/icons/ и запустите: ./generate-icons.sh');
        // Показываем сообщение об ошибке на странице
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #D8DEE9; font-family: monospace;';
        errorMsg.textContent = 'Иконки не найдены. Проверьте консоль браузера.';
        document.body.appendChild(errorMsg);
    }
  });
  