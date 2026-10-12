package com.mlrit.portal.service;

import com.mlrit.portal.model.AuditLog;
import com.mlrit.portal.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public AuditLog log(String actorUsername, String actorRole, String entityType, Long entityId,
                         String action, String oldValue, String newValue, String reason, String ipAddress) {
        AuditLog auditLog = new AuditLog(
                null,
                actorUsername,
                actorRole,
                entityType,
                entityId,
                action,
                oldValue,
                newValue,
                reason,
                ipAddress != null ? ipAddress : "127.0.0.1"
        );
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getLogsByEntityType(String entityType) {
        return auditLogRepository.findByEntityTypeOrderByCreatedAtDesc(entityType);
    }
}
