package com.mlrit.portal.repository;

import com.mlrit.portal.model.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByStudentIdOrderByPaymentDateDesc(Long studentId);
    Optional<FeePayment> findByReceiptNo(String receiptNo);

    @Query("SELECT COALESCE(SUM(f.amountPaid), 0) FROM FeePayment f WHERE f.student.id = :studentId AND f.status = 'SUCCESS'")
    BigDecimal sumAmountPaidByStudent(@Param("studentId") Long studentId);

    @Query("SELECT COALESCE(SUM(f.amountPaid), 0) FROM FeePayment f WHERE f.status = 'SUCCESS'")
    BigDecimal sumTotalFeeCollected();
}
