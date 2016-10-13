<?php

use Carbon\Carbon;

class ApiTransectAnnotationSessionControllerTest extends ApiTestCase
{
    public function testIndex()
    {
        $id = $this->transect()->id;
        $session = AnnotationSessionTest::create([
            'transect_id' => $this->transect()->id,
        ]);
        $session->users()->attach($this->guest());

        $this->doTestApiRoute('GET', "/api/v1/transects/{$id}/annotation-sessions");

        $this->beUser();
        $this->get("/api/v1/transects/{$id}/annotation-sessions");
        $this->assertResponseStatus(403);

        $this->beGuest();
        $this->get("/api/v1/transects/{$id}/annotation-sessions")
            ->seeJsonEquals([$session->load('users')->toArray()]);
        $this->assertResponseOk();
    }

    public function testStore()
    {
        $id = $this->transect()->id;
        AnnotationSessionTest::create([
            'transect_id' => $id,
            'starts_at' => '2016-09-03',
            'ends_at' => '2016-09-04',
        ]);

        $this->doTestApiRoute('POST', "/api/v1/transects/{$id}/annotation-sessions");

        $this->beEditor();
        $this->post("/api/v1/transects/{$id}/annotation-sessions");
        $this->assertResponseStatus(403);

        $this->beAdmin();
        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'starts_at' => '2016-09-05',
            'ends_at' => '2016-09-06',
            'users' => [$this->admin()->id],
        ]);
        // name is required
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'ends_at' => '2016-09-06',
            'users' => [$this->admin()->id],
        ]);
        // starts_at is required
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-05',
            'users' => [$this->admin()->id],
        ]);
        // ends_at is required
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-05',
            'ends_at' => '2016-09-04',
            'users' => [$this->admin()->id],
        ]);
        // end must be after start
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-03',
            'ends_at' => '2016-09-05',
            'users' => [$this->admin()->id],
        ]);
        // conflict with existing session
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-05',
            'ends_at' => '2016-09-06',
        ]);
        // users is required
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-05',
            'ends_at' => '2016-09-06',
            'users' => [999],
        ]);
        // user does not exist
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-05',
            'ends_at' => '2016-09-06',
            'users' => [$this->user()->id],
        ]);
        // user must belong to transect
        $this->assertResponseStatus(422);

        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-05',
            'ends_at' => '2016-09-06',
            'users' => [$this->admin()->id],
        ]);
        $this->assertResponseOk();
        $this->assertEquals(2, $this->transect()->annotationSessions()->count());

        $session = $this->transect()->annotationSessions()
            ->with('users')
            ->orderBy('id', 'desc')
            ->first();
        $this->assertTrue($session->users()->where('id', $this->admin()->id)->exists());
        $this->seeJsonEquals($session->toArray());
    }

    public function testStoreTimezones()
    {
        $id = $this->transect()->id;
        $this->beAdmin();
        $this->json('POST', "/api/v1/transects/{$id}/annotation-sessions", [
            'name' => 'my session',
            'starts_at' => '2016-09-20T00:00:00.000+02:00',
            'ends_at' => '2016-09-21T00:00:00.000+02:00',
            'users' => [$this->admin()->id],
        ]);
        $this->assertResponseOk();

        $session = $this->transect()->annotationSessions()->first();

        $this->assertTrue(Carbon::parse('2016-09-19T22:00:00.000Z')->eq($session->starts_at));
        $this->assertTrue(Carbon::parse('2016-09-20T22:00:00.000Z')->eq($session->ends_at));
    }
}
