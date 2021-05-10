package io.ionic.quesers;


        import com.getcapacitor.NativePlugin;
        import com.getcapacitor.Plugin;
        import com.getcapacitor.PluginCall;
        import com.getcapacitor.PluginMethod;
        import com.getcapacitor.JSObject;

@NativePlugin()
public class CustomNativePlugin extends Plugin {

    @PluginMethod()
    public void customCall(PluginCall call) {
        String message = call.getString("message");
        // More code here...
        JSObject obj = new JSObject();
        obj.put("value","the message you gave ");
        obj.put("message provided","message");
        call.success( obj);
    }

    @PluginMethod()
    public void customFunction(PluginCall call) {
        // More code here...
        call.resolve();
    }
}