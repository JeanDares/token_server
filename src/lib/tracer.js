const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const { TraceExporter, } =
require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } =
require('@opentelemetry/instrumentation-express');

const setupTracing = (serviceName) => {
  const provider = new NodeTracerProvider();
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
    HttpInstrumentation,
    ExpressInstrumentation,
    ],
  });

  const exporter = new TraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();
  return opentelemetry.trace.getTracer(serviceName);
}

module.exports = setupTracing;