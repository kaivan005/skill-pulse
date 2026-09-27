# SkillPulse IVR integration (disabled)

This directory is intentionally excluded from the active MVP. It documents the future IVR boundary without making calls or importing a telephony dependency.

## Activation checklist

1. Add a provider-specific client behind this interface.
2. Configure the environment variables in `config-example`.
3. Add server-side authentication and webhook signature verification.
4. Change `IVR_ENABLED` only in a controlled deployment.

The MVP must keep `IVR_ENABLED=false`. The dashboard displays IVR as coming soon / disabled. No real phone calls or requests are made here.

## Planned modules

- `ivr-client`: provider-neutral request interface
- `ivr-service`: call orchestration and response mapping
- `webhook-example`: inbound event shape
- `config-example`: environment variable placeholders
