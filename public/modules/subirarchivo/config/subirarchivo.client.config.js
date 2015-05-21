'use strict';

// Configuring the Articles module
angular.module('subirarchivo').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar','Interpretar archivo','subirarchivo');

    }
]);
