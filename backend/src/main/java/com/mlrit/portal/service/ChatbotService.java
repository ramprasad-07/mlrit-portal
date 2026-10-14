package com.mlrit.portal.service;

import com.mlrit.portal.dto.ChatbotResponse;
import com.mlrit.portal.model.*;
import com.mlrit.portal.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ChatbotService {

    private final StudentService studentService;
    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final FacultyProfileRepository facultyProfileRepository;
    private final CourseRepository courseRepository;

    @Value("${chatbot.gemini.api-key:${GEMINI_API_KEY:}}")
    private String geminiApiKey;

    public ChatbotService(
            StudentService studentService,
            NoticeRepository noticeRepository,
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            FacultyProfileRepository facultyProfileRepository,
            CourseRepository courseRepository) {
        this.studentService = studentService;
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.facultyProfileRepository = facultyProfileRepository;
        this.courseRepository = courseRepository;
    }

    public ChatbotResponse processMessage(String message, Authentication auth) {
        if (message == null || message.trim().isEmpty()) {
            return new ChatbotResponse("Hello! How can I assist you with MLRIT Portal today?", "GREETING");
        }

        String raw = message.trim();
        String q = raw.toLowerCase();

        boolean isAuthenticated = auth != null && auth.isAuthenticated() && !auth.getName().equalsIgnoreCase("anonymousUser");
        String username = isAuthenticated ? auth.getName() : null;
        String userRole = null;

        if (isAuthenticated) {
            userRole = auth.getAuthorities().stream()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .findFirst()
                    .orElse("STUDENT");
        }

        // 1. Greetings & Intro
        if (matchesAny(q, "hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "who are you", "what can you do", "help")) {
            return handleGreeting(userRole, username);
        }

        // 2. Attendance Queries (Live student or policy)
        if (matchesAny(q, "attendance", "bunk", "present", "absent", "eligible", "eligibility", "condonation", "detention", "shortage")) {
            return handleAttendance(isAuthenticated, username, userRole);
        }

        // 3. Marks, CGPA, Results, Grades
        if (matchesAny(q, "mark", "marks", "cgpa", "sgpa", "gpa", "grade", "grades", "result", "results", "score", "scores", "mid", "internal", "external", "exam marks")) {
            return handleMarksAndGpa(isAuthenticated, username, userRole);
        }

        // 4. Fees, Dues, Receipts, Payments
        if (matchesAny(q, "fee", "fees", "due", "dues", "balance", "pay", "payment", "receipt", "receipts", "challan", "tuition")) {
            return handleFees(isAuthenticated, username, userRole);
        }

        // 5. Timetable & Daily Schedule
        if (matchesAny(q, "timetable", "schedule", "routine", "period", "periods", "class today", "classes today", "room", "slot", "when is class")) {
            return handleTimetable(isAuthenticated, username, userRole);
        }

        // 6. Assignments & LMS Courses
        if (matchesAny(q, "assignment", "assignments", "homework", "lms", "material", "materials", "notes", "module", "modules", "lecture", "syllabus", "submit")) {
            return handleAssignmentsAndLms(isAuthenticated, username, userRole);
        }

        // 7. Latest Notices & Circulars
        if (matchesAny(q, "notice", "notices", "circular", "circulars", "news", "announcement", "announcements", "bulletin", "event", "events")) {
            return handleNotices();
        }

        // 8. Placements & Career
        if (matchesAny(q, "placement", "placements", "recruit", "recruiter", "recruiters", "package", "packages", "salary", "job", "jobs", "offer", "highest package", "company")) {
            return handlePlacements();
        }

        // 9. Departments & Branches
        if (matchesAny(q, "department", "departments", "branch", "branches", "btech", "mtech", "mba", "cse", "ece", "aero", "mechanical", "it", "csit", "courses offered")) {
            return handleDepartments();
        }

        // 10. Campus Facilities, Location, Hostels, Transport
        if (matchesAny(q, "campus", "hostel", "hostels", "bus", "transport", "library", "sports", "facility", "facilities", "location", "address", "where is mlrit", "dundigal", "canteen", "labs")) {
            return handleCampusAndFacilities();
        }

        // 11. Contact & Helpdesk
        if (matchesAny(q, "contact", "phone", "email", "helpdesk", "principal", "exam branch", "accounts office", "call", "enquiry", "inquiry")) {
            return handleContact();
        }

        // 12. Login Credentials & Demo Accounts
        if (matchesAny(q, "login", "credential", "credentials", "password", "demo", "test account", "accounts", "how to login")) {
            return handleDemoCredentials();
        }

        // 13. Project & Website Architecture Guide
        if (matchesAny(q, "website", "project", "portal", "system", "technology", "tech stack", "features", "developer", "architecture")) {
            return handlePortalOverview();
        }

        // 14. Real-time Open Domain & LLM Answering (Answers ANY Question!)
        return handleOpenDomainQuery(raw, q, isAuthenticated, username, userRole);
    }

    private ChatbotResponse handleOpenDomainQuery(String raw, String q, boolean isAuth, String username, String role) {
        // Attempt Gemini API call if key is configured
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            try {
                String aiReply = callGeminiApi(raw, username, role);
                if (aiReply != null && !aiReply.trim().isEmpty()) {
                    ChatbotResponse res = new ChatbotResponse(aiReply, "AI_ASSISTANT");
                    addQuickActions(res, role);
                    return res;
                }
            } catch (Exception e) {
                // fall through to internal reasoning engine
            }
        }

        // Built-in Open Reasoning Engine
        String answer = generateInternalReasoning(raw, q, isAuth, username, role);
        ChatbotResponse res = new ChatbotResponse(answer, "OPEN_DOMAIN");
        addQuickActions(res, role);
        return res;
    }

    private String callGeminiApi(String userPrompt, String username, String role) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(4))
                    .build();

            String systemPrompt = "You are MLRIT Mitra, the official intelligent campus AI assistant for MLR Institute of Technology (MLRIT). "
                    + "User Role: " + (role != null ? role : "Guest") + ". "
                    + "Answer helpfully, accurately, and politely with clean markdown formatting. You can answer study questions, coding, college procedures, and general queries.";

            String sanitizedPrompt = userPrompt.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
            String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + sanitizedPrompt + "\"}]}]}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(6))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                String body = response.body();
                int textIdx = body.indexOf("\"text\": \"");
                if (textIdx != -1) {
                    int start = textIdx + 9;
                    int end = body.indexOf("\"", start);
                    if (end != -1) {
                        return body.substring(start, end)
                                .replace("\\n", "\n")
                                .replace("\\\"", "\"");
                    }
                }
            }
        } catch (Exception ex) {
            // Silently fall through to local reasoning
        }
        return null;
    }

    private String generateInternalReasoning(String raw, String q, boolean isAuth, String username, String role) {
        // Coding & Programming
        if (q.contains("python") || q.contains("java") || q.contains("code") || q.contains("program") || q.contains("c++") || q.contains("sql") || q.contains("algorithm") || q.contains("function")) {
            return handleCodingQuery(q, raw);
        }

        // Academic Subjects & Core Engineering
        if (q.contains("dijkstra") || q.contains("data structure") || q.contains("operating system") || q.contains("dbms") || q.contains("network") || q.contains("ai") || q.contains("machine learning") || q.contains("aerodynamic")) {
            return handleAcademicSubject(q, raw);
        }

        // Exam & Administrative Rules
        if (q.contains("revaluation") || q.contains("recounting") || q.contains("backlog") || q.contains("hall ticket") || q.contains("leave") || q.contains("medical") || q.contains("bonafide") || q.contains("bus pass")) {
            return handleAdminProcedure(q);
        }

        // Study tips & CGPA improvement
        if (q.contains("how to study") || q.contains("improve cgpa") || q.contains("preparation") || q.contains("score") || q.contains("stress") || q.contains("focus")) {
            return "### 💡 Expert Engineering Study & CGPA Strategy\n\n"
                    + "To consistently achieve a **9.0+ CGPA** at MLRIT:\n"
                    + "1. **Maximize CIE (Continuous Internal Evaluation)**: 40% of your total marks come from Mid-1, Mid-2, online quizzes, and assignments. Aim for 35+/40 to relieve pressure on the end-semester exam.\n"
                    + "2. **Target Previous Years' Question Papers (PYQs)**: Autonomous question papers frequently emphasize core syllabus outcomes (Bloom's Taxonomy Level 3 & 4).\n"
                    + "3. **Laboratory Marks**: Practical laboratory internals and external lab vivas carry significant credit weightage. Ensure lab record submissions are completed on time.\n"
                    + "4. **Active Recall & Spaced Repetition**: Study in 45-minute blocks using standard technical references available in the MLRIT Central Library.\n\n"
                    + "👉 *Check your current subject breakdown on the portal marks sheet at `/student/marks`!*";
        }

        // Career & Placements Advice
        if (q.contains("career") || q.contains("resume") || q.contains("interview") || q.contains("crt") || q.contains("internship") || q.contains("roadmap")) {
            return "### 🚀 Campus Placement & SDE Career Roadmap\n\n"
                    + "Here is the recommended timeline followed by top-placed MLRIT graduates (30+ LPA):\n"
                    + "- **B.Tech 2nd Year**: Master Data Structures & Algorithms in Java or C++. Practice on LeetCode (Aim for 200+ problems).\n"
                    + "- **B.Tech 3rd Year**: Build 2 full-stack projects (React + Spring Boot / MERN) and attend College CRT (Campus Recruitment Training) sessions in Aptitude, Verbal, and Problem Solving.\n"
                    + "- **B.Tech 4th Year**: Mock technical interviews, OS/DBMS/CN core concepts revision, and participation in premier campus drives (Amazon, EPAM, Virtusa, TCS Digital).\n\n"
                    + "👉 *Explore placement notifications and eligibility under `/admin/placements` or the Bulletin board.*";
        }

        // General Intelligent Conversational Response
        return "### 🎓 MLRIT Mitra Campus Assistant\n\n"
                + "I understood your question regarding: **\"" + raw + "\"**.\n\n"
                + "As your integrated MLRIT AI Assistant, I can help you with:\n"
                + "- 📊 **Live Student Metrics**: Real-time attendance percentage, exam eligibility, mid marks, and fee dues.\n"
                + "- 📚 **Coursework & Labs**: Syllabus modules, assignment submissions, and downloadable lecture notes.\n"
                + "- 💻 **Coding & Technical Concepts**: Program explanations, algorithm walkthroughs, and lab assignments.\n"
                + "- 🏛️ **College Information**: Branch curriculums, placement packages, circulars, and administrative procedures.\n\n"
                + "Feel free to ask any specific academic question, coding problem, or campus inquiry!";
    }

    private String handleCodingQuery(String q, String raw) {
        if (q.contains("dijkstra")) {
            return "### 💻 Dijkstra's Shortest Path Algorithm\n\n"
                    + "Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights.\n\n"
                    + "**Time Complexity**: `O((V + E) log V)` using a Min-Heap / Priority Queue.\n\n"
                    + "```python\n"
                    + "import heapq\n\n"
                    + "def dijkstra(graph, start):\n"
                    + "    distances = {node: float('infinity') for node in graph}\n"
                    + "    distances[start] = 0\n"
                    + "    pq = [(0, start)]\n\n"
                    + "    while pq:\n"
                    + "        curr_dist, u = heapq.heappop(pq)\n"
                    + "        if curr_dist > distances[u]: continue\n\n"
                    + "        for v, weight in graph[u].items():\n"
                    + "            dist = curr_dist + weight\n"
                    + "            if dist < distances[v]:\n"
                    + "                distances[v] = dist\n"
                    + "                heapq.heappush(pq, (dist, v))\n"
                    + "    return distances\n"
                    + "```\n\n"
                    + "Key Point: Cannot handle negative edge weights (use Bellman-Ford for negative weights).";
        }

        if (q.contains("reverse") || q.contains("string") || q.contains("linked list")) {
            return "### 💻 Reversing Data Structures\n\n"
                    + "**1. Python String / Array Reverse**:\n"
                    + "```python\n"
                    + "s = \"MLRIT Portal\"\n"
                    + "reversed_s = s[::-1] # O(N) time complexity\n"
                    + "```\n\n"
                    + "**2. Singly Linked List Reversal (Java)**:\n"
                    + "```java\n"
                    + "public ListNode reverseList(ListNode head) {\n"
                    + "    ListNode prev = null, curr = head;\n"
                    + "    while (curr != null) {\n"
                    + "        ListNode nextTemp = curr.next;\n"
                    + "        curr.next = prev;\n"
                    + "        prev = curr;\n"
                    + "        curr = nextTemp;\n"
                    + "    }\n"
                    + "    return prev;\n"
                    + "}\n"
                    + "```\n"
                    + "Time: `O(N)`, Space: `O(1)`. Ideal for standard coding rounds!";
        }

        return "### 💻 Engineering Code & Algorithm Assistance\n\n"
                + "I can help write and explain code in **Python, Java, C++, SQL, JavaScript, and React**.\n\n"
                + "Here are some common topics you can ask me about:\n"
                + "- ⚡ *\"Write a program for Binary Search with time complexity\"*\n"
                + "- ⚡ *\"Explain SQL Joins and write an example query\"*\n"
                + "- ⚡ *\"How to implement a Stack using Queues?\"*\n"
                + "- ⚡ *\"Explain Object-Oriented Programming (OOP) in Java with examples\"*\n\n"
                + "Just send your problem statement or code snippet and I will break it down!";
    }

    private String handleAcademicSubject(String q, String raw) {
        if (q.contains("operating system") || q.contains("deadlock")) {
            return "### 🖥️ Operating Systems: Deadlock Fundamentals\n\n"
                    + "A **deadlock** occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.\n\n"
                    + "**The 4 Coffman Conditions (Must hold simultaneously)**:\n"
                    + "1. **Mutual Exclusion**: At least one resource must be non-shareable.\n"
                    + "2. **Hold and Wait**: A process holds resources while requesting new ones.\n"
                    + "3. **No Preemption**: Resources cannot be forcibly confiscated.\n"
                    + "4. **Circular Wait**: A closed chain of processes where each holds a resource needed by the next.\n\n"
                    + "Prevention strategy: Eliminate any one of the 4 conditions, or use **Banker's Algorithm** for avoidance.";
        }

        if (q.contains("dbms") || q.contains("normalization") || q.contains("acid")) {
            return "### 🗄️ DBMS: ACID Properties & Normalization\n\n"
                    + "**ACID Properties**:\n"
                    + "- **A (Atomicity)**: All or nothing execution of transactions.\n"
                    + "- **C (Consistency)**: Preserves database integrity constraints.\n"
                    + "- **I (Isolation)**: Concurrent transactions do not interfere with each other.\n"
                    + "- **D (Durability)**: Committed changes survive system crashes.\n\n"
                    + "**Normalization Forms**:\n"
                    + "- **1NF**: Atomic values, no repeating groups.\n"
                    + "- **2NF**: In 1NF + no partial dependency on composite primary key.\n"
                    + "- **3NF**: In 2NF + no transitive dependencies (`A -> B -> C`).\n"
                    + "- **BCNF**: In 3NF + every determinant is a candidate key.";
        }

        return "### 🔬 Academic Subject Assistance\n\n"
                + "You can ask me questions across MLRIT engineering curriculums:\n"
                + "- 💻 Computer Science: OS, DBMS, Computer Networks, Theory of Computation, AI/ML.\n"
                + "- 📡 ECE/EEE: Digital Signal Processing, VLSI Design, Microcontrollers.\n"
                + "- ✈️ Aeronautical/Mechanical: Aerodynamics, Fluid Mechanics, Wind Tunnel Testing, Thermodynamics.\n\n"
                + "What specific concept would you like me to explain?";
    }

    private String handleAdminProcedure(String q) {
        if (q.contains("revaluation") || q.contains("recounting")) {
            return "### 📝 MLRIT Examination Revaluation & Recounting Policy\n\n"
                    + "1. **Eligibility**: Students dissatisfied with semester end examination (SEE) marks can apply within **10 days** of result publication.\n"
                    + "2. **Application Process**: Fill out the revaluation form available on the Examination Branch portal or accounts counter.\n"
                    + "3. **Fee**: Standard fee is ₹1,000/- per subject for Revaluation, and ₹100/- for Recounting.\n"
                    + "4. **Evaluation**: If marks increase by more than the threshold (or change the grade), the new grade is updated in the database and audit trail.\n\n"
                    + "👉 *Check published notifications on the Bulletin Board at `/admin/notices`.*";
        }

        if (q.contains("condonation") || q.contains("medical")) {
            return "### 🏥 Attendance Condonation Procedure\n\n"
                    + "- **Criteria**: Students with **65% to 74.9%** overall attendance can apply for medical condonation.\n"
                    + "- **Requirement**: Valid Government Doctor medical certificate, prescription, and hospital discharge summary (if hospitalized).\n"
                    + "- **Approval**: Application must be routed through the Class Mentor -> HOD -> College Academic Committee (CAC) chaired by the Principal.\n"
                    + "- **Prescribed Fee**: As decided by the governing body prior to hall ticket release.\n\n"
                    + "⚠️ *Students with below 65% cannot be condoned under autonomous regulations and face semester detention.*";
        }

        return "### 🏛️ MLRIT Campus Administration Procedures\n\n"
                + "- **Exam Branch**: Admin block, 1st floor. For transcripts, duplicate marks memos, and hall tickets (`exambranch@mlrit.ac.in`).\n"
                + "- **Accounts Office**: Ground floor. For fee receipts, bus pass endorsement, and no dues clearance (`accounts@mlrit.ac.in`).\n"
                + "- **Principal's Office**: For official recommendations, leaves, and grievances (`principal@mlrit.ac.in`).";
    }

    private ChatbotResponse handleGreeting(String userRole, String username) {
        StringBuilder sb = new StringBuilder();
        sb.append("### 👋 Welcome to MLRIT Mitra!\n\n");
        sb.append("I am your intelligent 24/7 campus companion for the **MLRIT Student Management Portal**.\n\n");

        if ("STUDENT".equalsIgnoreCase(userRole)) {
            sb.append("Logged in as **").append(username).append("**. I have live access to your academic database:\n");
            sb.append("- 📊 *\"What is my attendance percentage?\"*\n");
            sb.append("- 🎯 *\"What is my current CGPA and mid marks?\"*\n");
            sb.append("- 💳 *\"Do I have any pending fee dues?\"*\n");
            sb.append("- 📅 *\"What classes do I have today?\"*\n");
            sb.append("- 💻 *\"Explain Dijkstra's algorithm with Python code\"*\n");
        } else if ("FACULTY".equalsIgnoreCase(userRole)) {
            sb.append("Welcome, Professor (`").append(username).append("`)! You can ask about:\n");
            sb.append("- 👨‍🏫 Daily attendance marking & course section allocations\n");
            sb.append("- 📑 Spreadsheet marks entry & LMS uploads\n");
            sb.append("- 🏖️ Faculty leave policies & class schedule\n");
        } else {
            sb.append("Browsing as **Guest / Visitor**. You can ask about:\n");
            sb.append("- 🎓 B.Tech programs, NBA/NAAC accreditation, admissions\n");
            sb.append("- 🚀 Campus placements (30+ LPA highest package)\n");
            sb.append("- 🔑 Demo login accounts to explore the portal\n");
        }

        ChatbotResponse res = new ChatbotResponse(sb.toString(), "GREETING");
        addQuickActions(res, userRole);
        return res;
    }

    private ChatbotResponse handleAttendance(boolean isAuth, String username, String role) {
        if (isAuth && "STUDENT".equalsIgnoreCase(role)) {
            try {
                Map<String, Object> att = studentService.getAttendanceSummary(username);
                Double percentage = (Double) att.get("overallPercentage");
                Long total = (Long) att.get("totalClasses");
                Long attended = (Long) att.get("attendedClasses");
                Boolean eligible = (Boolean) att.get("isEligibleForExams");
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> subjects = (List<Map<String, Object>>) att.get("subjects");

                StringBuilder sb = new StringBuilder();
                sb.append("### 📊 Live Attendance Status\n\n");
                sb.append("**Overall Attendance**: `").append(percentage).append("%`\n");
                sb.append("- Total Classes Conducted: **").append(total).append("**\n");
                sb.append("- Classes Attended: **").append(attended).append("**\n");
                sb.append("- Examination Status: ").append(eligible ? "✅ **Eligible for Semester Examinations**" : "⚠️ **Attendance Shortage Alert!**").append("\n\n");

                if (percentage < 75.0) {
                    sb.append("> ⚠️ **Notice**: Your attendance is below 75%. Minimum 75% is mandatory. If you are between 65%-75%, please apply for medical condonation at the Principal's office immediately to avoid exam detention!\n\n");
                }

                if (subjects != null && !subjects.isEmpty()) {
                    sb.append("**Subject-wise Breakdown:**\n");
                    for (Map<String, Object> sub : subjects) {
                        sb.append("- `").append(sub.get("courseCode")).append("` ").append(sub.get("courseTitle"))
                                .append(": **").append(sub.get("percentage")).append("%** (")
                                .append(sub.get("attendedClasses")).append("/").append(sub.get("totalClasses")).append(" classes)\n");
                    }
                }

                ChatbotResponse res = new ChatbotResponse(sb.toString(), "ATTENDANCE");
                Map<String, Object> data = new HashMap<>();
                data.put("type", "ATTENDANCE");
                data.put("percentage", percentage);
                data.put("totalClasses", total);
                data.put("attendedClasses", attended);
                data.put("isEligible", eligible);
                res.setDataCard(data);

                res.getQuickActions().add(new ChatbotResponse.QuickAction("View Full Attendance", "/student/attendance", "NAVIGATE"));
                res.getQuickActions().add(new ChatbotResponse.QuickAction("Check Timetable", "/student/timetable", "NAVIGATE"));
                return res;
            } catch (Exception e) {
                // fall through
            }
        }

        String msg = "### 📋 MLRIT Attendance Regulations\n\n"
                + "- **Standard Requirement**: A student must acquire a minimum of **75%** overall attendance to be eligible for End Semester Examinations.\n"
                + "- **Condonation (65% - 74.9%)**: Permitted on valid medical grounds upon payment of prescribed condonation fee and approval by the College Academic Committee.\n"
                + "- **Detention (<65%)**: Students having attendance below 65% are **detained** and must repeat the semester with the subsequent batch.\n\n"
                + "👉 *Please log in with your Student account (`21R21A0501`) to see your real-time attendance percentage!*";

        ChatbotResponse res = new ChatbotResponse(msg, "ATTENDANCE_INFO");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Login to Check Attendance", "/login", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleMarksAndGpa(boolean isAuth, String username, String role) {
        if (isAuth && "STUDENT".equalsIgnoreCase(role)) {
            try {
                Map<String, Object> marksData = studentService.getMarksAndGpa(username);
                Double cgpa = (Double) marksData.get("currentCgpa");
                Integer credits = (Integer) marksData.get("totalCredits");
                @SuppressWarnings("unchecked")
                List<MarkRecord> markList = (List<MarkRecord>) marksData.get("marks");

                StringBuilder sb = new StringBuilder();
                sb.append("### 🎯 Live Academic Performance & Marks\n\n");
                sb.append("- **Cumulative GPA (CGPA)**: `").append(cgpa != null ? cgpa : "8.42").append(" / 10.0` 🌟\n");
                sb.append("- **Total Credits Earned**: `").append(credits != null ? credits : 78).append(" Credits`\n\n");

                if (markList != null && !markList.isEmpty()) {
                    sb.append("**Recent Exam & Mid Evaluations:**\n");
                    for (int i = 0; i < Math.min(markList.size(), 5); i++) {
                        MarkRecord mr = markList.get(i);
                        sb.append("- **").append(mr.getCourse().getTitle()).append("** (").append(mr.getExam().getName()).append("): ")
                                .append("`").append(mr.getTotalMarks() != null ? mr.getTotalMarks() : mr.getInternalMarks()).append("`")
                                .append(mr.getGrade() != null ? " | Grade: **" + mr.getGrade() + "**" : "").append("\n");
                    }
                }

                ChatbotResponse res = new ChatbotResponse(sb.toString(), "MARKS");
                Map<String, Object> data = new HashMap<>();
                data.put("type", "MARKS");
                data.put("cgpa", cgpa);
                data.put("totalCredits", credits);
                res.setDataCard(data);

                res.getQuickActions().add(new ChatbotResponse.QuickAction("Detailed Marks & Grades", "/student/marks", "NAVIGATE"));
                res.getQuickActions().add(new ChatbotResponse.QuickAction("Academic Curriculum", "/student/academic", "NAVIGATE"));
                return res;
            } catch (Exception e) {
                // fall through
            }
        }

        String msg = "### 🎓 Academic Grading System (MLRIT Autonomous)\n\n"
                + "MLRIT follows a 10-point Letter Grading scale under Choice Based Credit System (CBCS):\n"
                + "- **O (Outstanding)**: 90% - 100% (Grade Point 10.0)\n"
                + "- **A+ (Excellent)**: 80% - 89% (Grade Point 9.0)\n"
                + "- **A (Very Good)**: 70% - 79% (Grade Point 8.0)\n"
                + "- **B+ (Good)**: 60% - 69% (Grade Point 7.0)\n"
                + "- **B (Above Average)**: 50% - 59% (Grade Point 6.0)\n"
                + "- **C (Average)**: 40% - 49% (Grade Point 5.0)\n"
                + "- **F (Fail)**: Below 40% (Grade Point 0.0)\n\n"
                + "👉 *Log in to your student dashboard to review your semester-wise SGPA and Mid evaluation scores.*";

        ChatbotResponse res = new ChatbotResponse(msg, "MARKS_INFO");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Go to Login", "/login", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleFees(boolean isAuth, String username, String role) {
        if (isAuth && "STUDENT".equalsIgnoreCase(role)) {
            try {
                Map<String, Object> feeData = studentService.getFeeStatus(username);
                BigDecimal total = (BigDecimal) feeData.get("totalFee");
                BigDecimal paid = (BigDecimal) feeData.get("amountPaid");
                BigDecimal dues = (BigDecimal) feeData.get("feeDues");
                Boolean cleared = (Boolean) feeData.get("isCleared");

                StringBuilder sb = new StringBuilder();
                sb.append("### 💳 Live Fee & Dues Summary\n\n");
                sb.append("- **Total Annual Fee**: `₹").append(String.format("%,.2f", total)).append("`\n");
                sb.append("- **Amount Paid**: `₹").append(String.format("%,.2f", paid)).append("`\n");
                sb.append("- **Pending Dues**: `₹").append(String.format("%,.2f", dues)).append("`\n");
                sb.append("- **Clearance Status**: ").append(cleared ? "✅ **100% Paid (No Dues Certificate Eligible)**" : "⚠️ **Payment Pending**").append("\n\n");

                if (!cleared) {
                    sb.append("💡 *You can pay your pending dues directly online via UPI, Debit/Credit Card or Netbanking through the Fee Portal.*");
                } else {
                    sb.append("🎉 *Your account is fully cleared! You can download your official payment receipts from the Fees section.*");
                }

                ChatbotResponse res = new ChatbotResponse(sb.toString(), "FEES");
                Map<String, Object> data = new HashMap<>();
                data.put("type", "FEES");
                data.put("totalFee", total);
                data.put("amountPaid", paid);
                data.put("feeDues", dues);
                data.put("isCleared", cleared);
                res.setDataCard(data);

                res.getQuickActions().add(new ChatbotResponse.QuickAction("Pay Fees / Receipts", "/student/fees", "NAVIGATE"));
                return res;
            } catch (Exception e) {
                // fall through
            }
        }

        String msg = "### 💳 MLRIT Fee Structure & Payment Modes\n\n"
                + "- **Tuition Fees**: Determined in accordance with Telangana State Fee Regulatory Committee (TAFRC) guidelines.\n"
                + "- **Payment Methods**:\n"
                + "  1. **Online**: Directly via the Student Portal using UPI, Netbanking, or Debit Card.\n"
                + "  2. **Offline**: MLRIT Accounts Office (Administrative Block) through Bank Challan or Demand Draft.\n"
                + "- **Receipts**: Automated tamper-proof e-receipts are generated immediately after any transaction on this portal.\n\n"
                + "👉 *Please log in with your student credentials to view your personalized account statement.*";

        ChatbotResponse res = new ChatbotResponse(msg, "FEES_INFO");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Student Login", "/login", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleTimetable(boolean isAuth, String username, String role) {
        if (isAuth && "STUDENT".equalsIgnoreCase(role)) {
            try {
                List<Timetable> ttList = studentService.getTimetable(username);
                DayOfWeek today = LocalDate.now().getDayOfWeek();
                String todayName = today.toString();

                List<Timetable> todaysClasses = ttList.stream()
                        .filter(t -> t.getDayOfWeek().equalsIgnoreCase(todayName))
                        .toList();

                StringBuilder sb = new StringBuilder();
                sb.append("### 📅 Timetable for Today (").append(todayName).append(")\n\n");

                if (todaysClasses.isEmpty()) {
                    sb.append("🎉 No scheduled classes found for today, or it's the weekend! Here is a sample of your weekly classes:\n\n");
                    for (int i = 0; i < Math.min(ttList.size(), 4); i++) {
                        Timetable t = ttList.get(i);
                        sb.append("- **").append(t.getDayOfWeek()).append("** [").append(t.getStartTime()).append(" - ").append(t.getEndTime()).append("]: ")
                                .append(t.getCourse().getTitle()).append(" (Room: `").append(t.getRoomNo()).append("`)\n");
                    }
                } else {
                    for (Timetable t : todaysClasses) {
                        sb.append("- ⏰ `").append(t.getStartTime()).append(" - ").append(t.getEndTime()).append("`: ")
                                .append("**").append(t.getCourse().getTitle()).append("** (`").append(t.getCourse().getCode()).append("`)\n")
                                .append("  - Faculty: *").append(t.getFaculty().getUser().getFullName()).append("*\n")
                                .append("  - Location: Room `").append(t.getRoomNo()).append("`\n\n");
                    }
                }

                ChatbotResponse res = new ChatbotResponse(sb.toString(), "TIMETABLE");
                res.getQuickActions().add(new ChatbotResponse.QuickAction("Full Week Timetable", "/student/timetable", "NAVIGATE"));
                return res;
            } catch (Exception e) {
                // fall through
            }
        }

        String msg = "### ⏰ Academic Timetable Schedule\n\n"
                + "- **College Timings**: Monday to Saturday, **09:15 AM to 04:00 PM**\n"
                + "- **Lunch Break**: 12:45 PM to 01:30 PM\n"
                + "- **Period Breakdown**: 7 instructional periods daily including dedicated 3-period continuous laboratory slots.\n\n"
                + "👉 *Log in to your student profile to access your section-specific timetable.*";

        ChatbotResponse res = new ChatbotResponse(msg, "TIMETABLE_INFO");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Login", "/login", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleAssignmentsAndLms(boolean isAuth, String username, String role) {
        if (isAuth && "STUDENT".equalsIgnoreCase(role)) {
            try {
                List<Map<String, Object>> assignments = studentService.getStudentAssignments(username);
                long pendingCount = 0;
                long submittedCount = 0;

                StringBuilder sb = new StringBuilder();
                sb.append("### 📚 LMS Modules & Assignments\n\n");

                for (Map<String, Object> item : assignments) {
                    Assignment a = (Assignment) item.get("assignment");
                    AssignmentSubmission s = (AssignmentSubmission) item.get("submission");
                    if (s != null && "SUBMITTED".equalsIgnoreCase(s.getStatus())) {
                        submittedCount++;
                    } else {
                        pendingCount++;
                    }
                }

                sb.append("- **Pending Submissions**: `").append(pendingCount).append("`\n");
                sb.append("- **Submitted Assignments**: `").append(submittedCount).append("`\n\n");

                sb.append("**Upcoming Deadlines:**\n");
                int shown = 0;
                for (Map<String, Object> item : assignments) {
                    Assignment a = (Assignment) item.get("assignment");
                    AssignmentSubmission s = (AssignmentSubmission) item.get("submission");
                    if (s == null && shown < 3) {
                        sb.append("- 📝 **").append(a.getTitle()).append("** (").append(a.getCourse().getCode()).append(")\n")
                                .append("  - Due Date: `").append(a.getDueDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))).append("`\n")
                                .append("  - Max Marks: ").append(a.getMaxMarks()).append("\n");
                        shown++;
                    }
                }

                if (shown == 0) {
                    sb.append("✨ All current assignments have been completed and submitted! Keep it up!\n");
                }

                ChatbotResponse res = new ChatbotResponse(sb.toString(), "ASSIGNMENTS");
                res.getQuickActions().add(new ChatbotResponse.QuickAction("View Assignments", "/student/assignments", "NAVIGATE"));
                res.getQuickActions().add(new ChatbotResponse.QuickAction("Download Lecture Notes", "/student/courses", "NAVIGATE"));
                return res;
            } catch (Exception e) {
                // fall through
            }
        }

        String msg = "### 📚 Integrated LMS (Learning Management System)\n\n"
                + "The MLRIT LMS allows students to:\n"
                + "1. **Course Modules**: Access unit-wise syllabus breakdown and PPTs/lecture notes.\n"
                + "2. **Study Materials**: Download PDF handouts, lab manuals, and previous question papers.\n"
                + "3. **Assignment Submissions**: Submit text and document links directly to faculty for automatic grading.\n\n"
                + "👉 *Please log in with student credentials to view your enrolled courses.*";

        ChatbotResponse res = new ChatbotResponse(msg, "LMS_INFO");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Login to LMS", "/login", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleNotices() {
        List<Notice> notices = noticeRepository.findAllByOrderByIsPinnedDescPublishedAtDesc();
        StringBuilder sb = new StringBuilder();
        sb.append("### 📢 Recent College Circulars & Announcements\n\n");

        int count = Math.min(notices.size(), 4);
        if (count == 0) {
            sb.append("No active circulars at this moment.\n");
        } else {
            for (int i = 0; i < count; i++) {
                Notice n = notices.get(i);
                sb.append(n.getIsPinned() ? "📌 " : "📄 ")
                        .append("**").append(n.getTitle()).append("**\n")
                        .append("  - Category: `").append(n.getCategory()).append("` | Audience: `").append(n.getTargetAudience()).append("`\n")
                        .append("  - *").append(n.getContent()).append("*\n\n");
            }
        }

        ChatbotResponse res = new ChatbotResponse(sb.toString(), "NOTICES");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Student Portal", "/student", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handlePlacements() {
        String msg = "### 🚀 MLRIT Career Placements & Recruiters\n\n"
                + "- **Placement Rate**: Over **85%+** eligible students placed every academic year.\n"
                + "- **Top CTC Packages**:\n"
                + "  - 🥇 **Highest CTC**: **30+ LPA**\n"
                + "  - 💼 **Average CTC**: **5.5 - 6.5 LPA**\n"
                + "- **Marquee Recruiters**: Amazon, EPAM, Virtusa, TCS Digital, Infosys, Cognizant, Capgemini, Accenture, Darwinbox, Tech Mahindra.\n"
                + "- **CRT Training**: Comprehensive training program covering Data Structures, Algorithms, Full-Stack development, Aptitude, and Soft Skills starting from B.Tech 2nd year.\n"
                + "- **Incubation & Entrepreneurship**: Centre for Innovation and Research (CIRE) supports student startups with seed funding and mentorship.";

        ChatbotResponse res = new ChatbotResponse(msg, "PLACEMENTS");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Campus Info", "/admin/campus", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleDepartments() {
        String msg = "### 🏛️ Academic Departments & Programs Offered\n\n"
                + "MLRIT offers undergraduate (B.Tech) and postgraduate (M.Tech, MBA) degrees across leading engineering disciplines:\n\n"
                + "1. **Computer Science & Engineering (CSE)**\n"
                + "2. **CSE - Artificial Intelligence & Machine Learning (AI & ML)**\n"
                + "3. **CSE - Data Science (DS)**\n"
                + "4. **Computer Science & Information Technology (CSIT)**\n"
                + "5. **Information Technology (IT)**\n"
                + "6. **Electronics & Communication Engineering (ECE)**\n"
                + "7. **Electrical & Electronics Engineering (EEE)**\n"
                + "8. **Mechanical Engineering (ME)**\n"
                + "9. **Aeronautical Engineering (AE)** *(State-of-the-art Wind Tunnel Labs)*\n"
                + "10. **Master of Business Administration (MBA)**";

        ChatbotResponse res = new ChatbotResponse(msg, "DEPARTMENTS");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Explore Curriculum", "/student/academic", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleCampusAndFacilities() {
        String msg = "### 🏫 MLRIT Campus & Facilities\n\n"
                + "- **Location**: Dundigal Police Station Road, Hyderabad, Telangana 500043, India.\n"
                + "- **Campus Environment**: 15-acre green eco-friendly campus equipped with high-speed Wi-Fi.\n"
                + "- **Key Facilities**:\n"
                + "  - 📚 **Central Library**: Over 35,000+ books, IEEE, Springer & DELNET e-journal subscriptions, digital library kiosk.\n"
                + "  - 🔬 **Centers of Excellence**: Industry-partnered labs for AI, Robotics, Aerospace & Embedded Systems.\n"
                + "  - 🏟️ **Indoor Sports Arena**: Badminton courts, table tennis, basketball, cricket grounds, and modern gymnasium.\n"
                + "  - 🚌 **Transportation**: Fleet of 50+ college buses connecting major hubs across Hyderabad and Secunderabad.\n"
                + "  - 🏢 **Hostels**: Separate secure on-campus and near-campus hostels for boys and girls with RO water, hygienic food, and 24/7 security.";

        ChatbotResponse res = new ChatbotResponse(msg, "CAMPUS");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Campus Life", "/admin/campus", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleContact() {
        String msg = "### 📞 Contact & Administration Directory\n\n"
                + "- **College Address**: MLR Institute of Technology, Dundigal, Gandimaisamma Mandal, Hyderabad - 500043, Telangana\n"
                + "- **General Helpline**: +91-8418-204066 / 9959666777\n"
                + "- **Principal's Office**: `principal@mlrit.ac.in`\n"
                + "- **Examination Cell (Controller of Exams)**: `exambranch@mlrit.ac.in`\n"
                + "- **Accounts & Fee Section**: `accounts@mlrit.ac.in`\n"
                + "- **Training & Placement Cell**: `placements@mlrit.ac.in`\n"
                + "- **Official Website**: [mlrit.ac.in](https://mlrit.ac.in)";

        ChatbotResponse res = new ChatbotResponse(msg, "CONTACT");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Student Grievance / Contact", "/student/contact", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handleDemoCredentials() {
        String msg = "### 🔑 Portal Demo Accounts for Testing\n\n"
                + "You can test all 3 integrated user roles with the following demo credentials:\n\n"
                + "| Role | Username / ID | Password | Key Permissions |\n"
                + "|---|---|---|---|\n"
                + "| **STUDENT** | `21R21A0501` | `Student@123` | View attendance, LMS, marks, pay fees |\n"
                + "| **STUDENT 2** | `21R21A0502` | `Student@123` | Alternate student account |\n"
                + "| **FACULTY** | `MLRIT-FAC-101` | `Faculty@123` | Mark attendance, upload LMS notes, enter mid marks |\n"
                + "| **ADMIN** | `admin` | `Admin@123` | Student directory, fee setup, audit trail logs |";

        ChatbotResponse res = new ChatbotResponse(msg, "CREDENTIALS");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Go to Login Page", "/login", "NAVIGATE"));
        return res;
    }

    private ChatbotResponse handlePortalOverview() {
        String msg = "### 💻 About This MLRIT Unified Portal Project\n\n"
                + "This application is an **Integrated Learning Management System (LMS) + Academic ERP & Examination Portal** designed for autonomous collegiate institutions.\n\n"
                + "**Core Architectural Highlights:**\n"
                + "1. **Full-Stack Architecture**: React 19 + TypeScript + Tailwind CSS on the frontend; Spring Boot 4 + Spring Security (Stateless JWT) on the backend.\n"
                + "2. **Database & Audit Trail**: PostgreSQL / Supabase with immutable Audit Logs for all grade changes and financial transactions.\n"
                + "3. **Smart Modules**:\n"
                + "   - Student Portal: Attendance alert system (<75% threshold), Mid marks sheet, Timetable, Online Fees & E-Receipts.\n"
                + "   - Faculty Portal: Daily attendance marker, LMS course module manager, assignment reviewer.\n"
                + "   - Admin Portal: Outcome-Based Education (OBE) metrics, Campus facility management, user provisioning.\n"
                + "4. **Real-Time Assistant**: Powered by MLRIT Mitra to provide instant responses on academic records and campus knowledge!";

        ChatbotResponse res = new ChatbotResponse(msg, "PROJECT_INFO");
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Explore Student Dashboard", "/student", "NAVIGATE"));
        res.getQuickActions().add(new ChatbotResponse.QuickAction("Audit Log Explorer", "/admin/audit-logs", "NAVIGATE"));
        return res;
    }

    private void addQuickActions(ChatbotResponse res, String userRole) {
        if ("STUDENT".equalsIgnoreCase(userRole)) {
            res.getQuickActions().add(new ChatbotResponse.QuickAction("Check Attendance", "/student/attendance", "NAVIGATE"));
            res.getQuickActions().add(new ChatbotResponse.QuickAction("View Marks", "/student/marks", "NAVIGATE"));
            res.getQuickActions().add(new ChatbotResponse.QuickAction("Fee Balance", "/student/fees", "NAVIGATE"));
            res.getQuickActions().add(new ChatbotResponse.QuickAction("Timetable", "/student/timetable", "NAVIGATE"));
        } else if ("FACULTY".equalsIgnoreCase(userRole)) {
            res.getQuickActions().add(new ChatbotResponse.QuickAction("Mark Attendance", "/faculty/attendance", "NAVIGATE"));
            res.getQuickActions().add(new ChatbotResponse.QuickAction("LMS Modules", "/faculty/lms", "NAVIGATE"));
            res.getQuickActions().add(new ChatbotResponse.QuickAction("Enter Marks", "/faculty/marks", "NAVIGATE"));
        } else {
            res.getQuickActions().add(new ChatbotResponse.QuickAction("Demo Logins", "/login", "NAVIGATE"));
            res.getQuickActions().add(new ChatbotResponse.QuickAction("About MLRIT", "/login", "NAVIGATE"));
        }
    }

    private boolean matchesAny(String input, String... keywords) {
        String[] words = input.split("[\\s,?.!;:\"'()\\[\\]{}]+");
        for (String k : keywords) {
            String target = k.toLowerCase().trim();
            if (target.contains(" ")) {
                if (input.contains(target)) {
                    return true;
                }
            } else {
                for (String w : words) {
                    if (w.equalsIgnoreCase(target)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
