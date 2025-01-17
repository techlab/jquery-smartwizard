/// <reference types="jquery" />

interface PluginOptions {
    color?: string;
    fontSize?: string;
}

const defaultOptions: PluginOptions = {
    color: "black",
    fontSize: "16px",
};

(function ($: JQueryStatic) {
    $.fn.myPlugin = function (options?: PluginOptions): JQuery {
        // Merge user options with defaults
        const settings = $.extend({}, defaultOptions, options);

        return this.each(function () {
            const $this = $(this);

            // Apply styles
            $this.css({
                color: settings.color,
                fontSize: settings.fontSize,
            });

            // Example: Add a click event
            $this.on("click", function () {
                alert("Element clicked!");
            });
        });
    };
})(jQuery);

// Usage
// $(document).ready(function () {
//     $(".example").myPlugin({ color: "red", fontSize: "20px" });
// });

// ------------------
/// <reference types="jquery" />

interface PluginOptions {
    color?: string;
    fontSize?: string;
}

const defaultOptions: PluginOptions = {
    color: "black",
    fontSize: "16px",
};

class MyPlugin {
    private $element: JQuery;
    private settings: PluginOptions;

    constructor(element: JQuery, options?: PluginOptions) {
        this.$element = element;
        this.settings = $.extend({}, defaultOptions, options);

        this.init();
    }

    private init(): void {
        this.applyStyles();
        this.bindEvents();
    }

    private applyStyles(): void {
        this.$element.css({
            color: this.settings.color,
            fontSize: this.settings.fontSize,
        });
    }

    private bindEvents(): void {
        this.$element.on("click.myPlugin", () => {
            this.handleClick();
        });
    }

    private handleClick(): void {
        alert(`Clicked: ${this.$element.text()}`);
    }

    public updateOptions(newOptions: PluginOptions): void {
        this.settings = $.extend({}, this.settings, newOptions);
        this.applyStyles();
    }

    public destroy(): void {
        this.$element.off(".myPlugin");
        this.$element.removeData("myPlugin");
    }
}

// jQuery Plugin Wrapper
(function ($: JQueryStatic) {
    $.fn.myPlugin = function (methodOrOptions?: string | PluginOptions, ...args: any[]): any {
        return this.each(function () {
            let $this = $(this);
            let instance = $this.data("myPlugin") as MyPlugin | undefined;

            if (!instance) {
                instance = new MyPlugin($this, typeof methodOrOptions === "object" ? methodOrOptions : undefined);
                $this.data("myPlugin", instance);
            }

            if (typeof methodOrOptions === "string" && instance[methodOrOptions as keyof MyPlugin]) {
                (instance[methodOrOptions as keyof MyPlugin] as Function).apply(instance, args);
            }
        });
    };
})(jQuery);

// Usage Example
$(document).ready(function () {
    let $example = $(".example").myPlugin({ color: "blue", fontSize: "18px" });

    // Update options dynamically
    setTimeout(() => {
        $example.myPlugin("updateOptions", { color: "green" });
    }, 2000);

    // Destroy plugin after 5 seconds
    setTimeout(() => {
        $example.myPlugin("destroy");
    }, 5000);
});

// Features Included
// ✅ Encapsulated Class-Based Plugin
// ✅ Options Merging & Dynamic Updates
// ✅ Public Methods (updateOptions, destroy)
// ✅ Event Handling with Namespaced Events
// ✅ Data Storage for Plugin Instance
// ✅ Proper jQuery Chainability

// This skeleton can be extended further with more features like animations, additional event bindings, or AJAX integrations.
