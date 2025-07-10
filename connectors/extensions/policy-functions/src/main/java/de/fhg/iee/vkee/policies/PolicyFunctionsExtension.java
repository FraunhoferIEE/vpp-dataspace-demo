package de.fhg.iee.vkee.policies;


import org.eclipse.edc.policy.engine.spi.PolicyEngine;
import org.eclipse.edc.policy.engine.spi.RuleBindingRegistry;
import org.eclipse.edc.policy.model.Permission;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.spi.monitor.Monitor;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

import static org.eclipse.edc.connector.contract.spi.offer.ContractDefinitionResolver.CATALOGING_SCOPE;
import static org.eclipse.edc.jsonld.spi.PropertyAndTypeNames.ODRL_USE_ACTION_ATTRIBUTE;
import static org.eclipse.edc.policy.engine.spi.PolicyEngine.ALL_SCOPES;
import static org.eclipse.edc.spi.CoreConstants.EDC_NAMESPACE;

public class PolicyFunctionsExtension implements ServiceExtension {

    public static final String IDENTITY_KEY = EDC_NAMESPACE + "identity";

    @Inject
    private RuleBindingRegistry ruleBindingRegistry;

    @Inject
    private PolicyEngine policyEngine;

    @Override
    public void initialize(ServiceExtensionContext context) {
        Monitor monitor = context.getMonitor();
        monitor.info("Registering policy function " + IdentityConstraintFunction.class.getName());
        ruleBindingRegistry.bind(ODRL_USE_ACTION_ATTRIBUTE, ALL_SCOPES);

        // Identity is evaluated in the context of the cataloging and negotiation scopes.
        ruleBindingRegistry.bind(IDENTITY_KEY, CATALOGING_SCOPE);


       // ruleBindingRegistry.bind(IDENTITY_KEY, NEGOTIATION_SCOPE);
        policyEngine.registerFunction(ALL_SCOPES, Permission.class, IDENTITY_KEY, new IdentityConstraintFunction(monitor));
    }
}
