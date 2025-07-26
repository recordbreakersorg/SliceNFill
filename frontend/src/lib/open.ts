import Engine from "./engine";
import { EnginesStore, CurrentEngineStore } from "./editor";
import { OpenFile } from "./wailsjs/go/backend/App";
export async function* open(path: string | null = null): AsyncGenerator<boolean | string> {
  console.log("[open.js] Opening engine with path:", path);
  yield true;
  try {
    if (path == null) {
      path ??= await OpenFile();
    }
    if (path == "") {
      yield false;
      return;
    }
    try {
      var engine = await Engine.create(path);
    } catch (error: any) {
      console.error("[open.js] Error creating engine:", error);
      return;
    }
    if (engine) {
      console.log("[open.js] Engine created successfully:", engine);
      EnginesStore.update((engines: Engine[]) =>
        engines.concat(engine),
      );
      CurrentEngineStore.set(engine);
      console.log("[open.js] Engine created:", engine);
    } else {
      console.error("[open.js] Failed to create engine.");
      yield "Failed to create engine.";
    }
  } catch (error: any) {
    console.error("[open.js] Error opening engine:", error);
    yield error.message;
  }

}
