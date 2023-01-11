const ui = require("ui-lib2/library");

const core = require("pictologic/core");

var ptl;

ui.addMenuButton("PicToLogic", "paste", () => {
	ptl.show();
});

ui.onLoad(() => {
	// Add button in Schematics dialog
	Vars.ui.schematics.buttons.button("PicToLogic", Icon.paste, () => {
		ptl.show();
	});

	ptl = new BaseDialog("PicToLogic");

	ptl.cont.add("[coral]1.[] Выберите PNG файл.");
	ptl.cont.row();
	ptl.cont.add("[coral]2.[] Нажми на [stat]Export[] чтобы создать схему.");
	ptl.cont.row();
	ptl.cont.add("[coral]Пожалуйста, не используйте это для пушистого дерьма, спасибо");
	ptl.cont.row();

	ptl.cont.button("Выбрать PNG", () => {
		Vars.platform.showFileChooser(false, "png", file => {
			try {
				const bytes = file.readBytes();
				core.image = new Pixmap(bytes);
			} catch (e) {
				ui.showError("Failed to load source image", e);
			}
		});
	}).size(240, 50);
	ptl.cont.row();
	ptl.cont.add("[coral]@xar4a – gay");
	ptl.cont.row();

	ptl.cont.label(() => core.stage).center();

	ptl.addCloseButton();
	ptl.buttons.button("$settings", Icon.settings, () => {
		core.settings.show();
	});
	ptl.buttons.button("Export", Icon.export, () => {
		new java.lang.Thread(() => {
			try {
				core.export(core.image);
				ptl.hide();
			} catch (e) {
				Core.app.post(() => {
					ui.showError("Failed to export schematic", e);
					core.stage = "";
				});
			}
		}, "PicToLogic worker").start();
	}).disabled(() => !core.image || core.stage != "");

	core.build();
});
