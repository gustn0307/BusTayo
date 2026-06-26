package com.busTajo.busTayo.lost.repository;

import com.busTajo.busTayo.bus.entity.BusCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LostRepository extends JpaRepository<BusCompany, Long> {

    @Query(value = "SELECT * FROM bus_company " +
            "WHERE company_name LIKE CONCAT('%', :companyName, '%') " +
            "OR :companyName LIKE CONCAT('%', company_name, '%') " +
            "LIMIT 1",
            nativeQuery = true)
    Optional<BusCompany> findByCompanyNameLike(@Param("companyName") String companyName);
}
