package de.fhg.iee.vkee.policies;


import org.eclipse.edc.policy.engine.spi.AtomicConstraintFunction;
import org.eclipse.edc.policy.engine.spi.PolicyContext;
import org.eclipse.edc.policy.model.Operator;
import org.eclipse.edc.policy.model.Permission;
import org.eclipse.edc.spi.agent.ParticipantAgent;
import org.eclipse.edc.spi.monitor.Monitor;

import java.util.Objects;

import static java.lang.String.format;

public class IdentityConstraintFunction implements AtomicConstraintFunction<Permission> {

    private final Monitor monitor;

    public IdentityConstraintFunction(Monitor monitor) {
        this.monitor = monitor;
    }

    @Override
    public boolean evaluate(Operator operator, Object rightValue, Permission permission, PolicyContext policyContext) {

        // The operator is checked to see if it is supported for the IdentityConstraintFunction class.
        switch (operator) {
            case EQ, NEQ -> {
            }
            default ->
                    throw new IllegalArgumentException(format("Operator %s is not supported for %s", operator, IdentityConstraintFunction.class.getName()));
        }

        // Debugging information is printed to the console.
        monitor.debug(format("Evaluating constraint: identity %s %s", operator, rightValue.toString()));
        monitor.debug(format("Identity: %s", policyContext.getContextData(ParticipantAgent.class).getIdentity()));
        policyContext.getContextData(ParticipantAgent.class).getClaims().forEach((k, v) -> monitor.debug(format("Claim: %s = %s", k, v)));
        policyContext.getContextData(ParticipantAgent.class).getAttributes().forEach((k, v) -> monitor.debug(format("Attribute: %s = %s", k, v)));

        var identity = policyContext.getContextData(ParticipantAgent.class).getIdentity();

        return switch (operator) {
            case EQ -> Objects.equals(identity, rightValue);
            case NEQ -> !Objects.equals(identity, rightValue);
            default -> false;
        };
    }
}

