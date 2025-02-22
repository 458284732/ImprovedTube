'use strict';

/*------------------------------------------------------------------------------
>>> "SLIDER" COMPONENT:
------------------------------------------------------------------------------*/

Satus.prototype.components.slider = {
    name: 'Slider',
    version: '1.0',
    status: 2,

    get: function(name, object) {
        var self = this,
            component = document.createElement('div'),
            component_label = document.createElement('span'),
            component_track_container = document.createElement('div'),
            component_track = document.createElement('div'),
            component_thumb = document.createElement('div'),
            min = object.min || 0,
            max = object.max || 1,
            step = object.step || 1,
            value = this.storage.get((object.storage_path || '') + '/' + name) || object.value || 0;

        if (this.storage.get((object.storage_path || '') + '/' + name) === 0) {
            value = 0;
        }

        object.tabindex = true;

        component_label.classList.add('label');
        component_track_container.classList.add('track-container');
        component_track.classList.add('track');
        component_thumb.classList.add('thumb');

        component_label.innerText = this.storage.get('locale/' + object.label) || object.label || this.storage.get('locale/' + name) || name;

        component.dataset.value = value;
        component_thumb.dataset.value = value;
        component_thumb.style.left = value * 100 / (max - min) + '%';
        component_track.style.width = value * 100 / (max - min) + '%';

        component_track_container.appendChild(component_track);
        component_track_container.appendChild(component_thumb);
        component.appendChild(component_label);
        component.appendChild(component_track_container);

        component.change = function(value) {
            value = value;

            this.dataset.value = value;
            component_thumb.dataset.value = value;
            this.querySelector('.thumb').style.left = value * 100 / (max - min) + '%';
            this.querySelector('.track').style.width = value * 100 / (max - min) + '%';
        }

        component.addEventListener('mousedown', function(event) {
            if (event.button == 0) {
                function move(event) {
                    var clientX = event.clientX,
                        clientRectX = component_track_container.getBoundingClientRect().left,
                        x = clientX - clientRectX,
                        width = component_track_container.offsetWidth;

                    if (x < 0) {
                        x = 0;
                    } else if (x > width) {
                        x = width;
                    }

                    var steps = Math.round(x / (width / ((max - min) / step)));

                    x = steps * 100 / ((max - min) / step);

                    var value = steps * step + min;

                    component.dataset.value = Number(value.toFixed(2));
                    component_thumb.dataset.value = Number(value.toFixed(2));
                    self.storage.set(name, Number(value.toFixed(2)), object.storage_path);
                    if (object.onchange) {
                        object.onchange(Number(value.toFixed(2)));
                    }

                    component_thumb.style.left = x + '%';
                    component_track.style.width = x + '%';
                }

                function blur() {
                    window.removeEventListener('mouseup', blur);
                    window.removeEventListener('mousemove', move);
                }

                move(event);
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', blur);
            }
        });

        component.addEventListener('keydown', function(event) {
            if (event.keyCode == 37 || event.keyCode == 39) {
                event.preventDefault();

                var value = Number(this.dataset.value);

                if (event.keyCode == 37 && value > min) {
                    value -= step;
                } else if (event.keyCode == 39 && value < max) {
                    value += step;
                }

                var x = (value - min) * 100 / (max - min);

                this.querySelector('.thumb').style.left = x + '%';
                this.querySelector('.track').style.width = x + '%';

                this.dataset.value = Number(value.toFixed(2));
                component_thumb.dataset.value = Number(value.toFixed(2));
                self.storage.set(name, Number(value.toFixed(2)), object.storage_path);
                if (object.onchange) {
                    object.onchange(Number(value.toFixed(2)));
                }
            }
        });

        return component;
    }
};