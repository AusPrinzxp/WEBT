<?php
    $conn = new mysqli("localhost", "root", "", "virtual_fridge");
	$rmethod = $_SERVER['REQUEST_METHOD'];

    if ($rmethod == "GET") {

		$stmt = $conn->prepare("SELECT id, foodname, fooddesc, calories, vegan FROM food");
		$stmt->execute();

		$result = $stmt->get_result();
		$foods = $result->fetch_all(MYSQLI_ASSOC);
		echo json_encode($foods);

	} else if ($rmethod == "POST") { 

        $request = json_decode(file_get_contents("php://input"));

		validateRequest($request);

		$query = "INSERT INTO food (foodname, fooddesc, calories, vegan) VALUES (?, ?, ?, ?)";

        $stmt = $conn->prepare($query);
        $stmt->bind_param('ssii', $request->foodname, $request->fooddesc, $request->calories, $request->vegan);
        $res = $stmt->execute();
    
        validate($res, 'Error occured during insertion', 400);
	}

    mysqli_close($conn);

    function validate($condition, $message, $code) {
        if (!$condition) {
            echo json_encode(['message' => $message]);
            http_response_code($code);
            exit;
        }
    }

    function validateRequest($request) {
        validate($request != null, 'Valid JSON syntax required', 400);
    
        validate(isset($request->foodname), 'Property "food name" is required', 400);
        validate(isset($request->calories), 'Property "calories" is required', 400);
        validate(isset($request->vegan), 'Property "vegan" is required', 400);

        $vegan = intval($request->vegan);
        validate($vegan == 0 || $vegan == 1, 'Property "vegan" must be 0 or 1', 400);
    }
?>