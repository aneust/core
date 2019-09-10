<?php

namespace Biigle\Tests\Modules\Volumes\Http\Controllers\Api;

use ApiTestCase;
use Biigle\Tests\ImageTest;
use Illuminate\Http\UploadedFile;

class VolumeImageMetadataControllerTest extends ApiTestCase
{
    protected function getCsv($name)
    {
        $csv = __DIR__."/../../../files/{$name}";

        return new UploadedFile($csv, 'image-metadata.csv', 'text/csv', null, null, true);
    }

    public function testStore()
    {
        $id = $this->volume()->id;

        $this->doTestApiRoute('POST', "/api/v1/volumes/{$id}/images/metadata");

        $csv = $this->getCsv('image-metadata.csv');
        $this->beEditor();
        // no permissions
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(403);

        $this->beAdmin();
        // file required
        $this->postJson("/api/v1/volumes/{$id}/images/metadata")->assertStatus(422);

        $csv = $this->getCsv('image-metadata-nocols.csv');
        // columns required
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata-wrongcols.csv');
        // columns content invalid
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata-colcount.csv');
        // columns don't match file
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata.csv');
        // image does not exist
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $png = ImageTest::create([
            'filename' => 'abc.png',
            'volume_id' => $id,
        ]);
        $jpg = ImageTest::create([
            'filename' => 'abc.jpg',
            'volume_id' => $id,
            'attrs' => ['metadata' => [
                'water_depth' => 4000,
                'distance_to_ground' => 20,
            ]],
        ]);

        $this->assertFalse($this->volume()->hasGeoInfo());

        $csv = $this->getCsv('image-metadata.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(200);

        $this->assertTrue($this->volume()->hasGeoInfo());

        $png = $png->fresh();
        $jpg = $jpg->fresh();

        $this->assertEquals('2016-12-19 12:27:00', $jpg->taken_at);
        $this->assertEquals(52.220, $jpg->lng);
        $this->assertEquals(28.123, $jpg->lat);
        $this->assertEquals(-1500, $jpg->metadata['gps_altitude']);
        $this->assertEquals(2.6, $jpg->metadata['area']);
        // Import should update but not destroy existing metadata.
        $this->assertEquals(10, $jpg->metadata['distance_to_ground']);
        $this->assertEquals(4000, $jpg->metadata['water_depth']);

        $this->assertNull($png->taken_at);
        $this->assertNull($png->lng);
        $this->assertNull($png->lat);
        $this->assertEmpty($png->metadata);
    }

    public function testStoreInvalidLonLat()
    {
        $id = $this->volume()->id;
        $image = ImageTest::create([
            'filename' => 'abc.jpg',
            'volume_id' => $id,
        ]);
        $this->beAdmin();
        $csv = $this->getCsv('image-metadata-nolat.csv');
        // lng requires lat, too
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata-nolng.csv');
        // lat requires lng, too
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata-colordering.csv');
        // date is no valid longitude
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata-invalid-lat.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);

        $csv = $this->getCsv('image-metadata-invalid-lng.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(422);
    }

    public function testStoreCaseInsensitive()
    {
        $id = $this->volume()->id;
        $image = ImageTest::create([
            'filename' => 'abc.jpg',
            'volume_id' => $id,
        ]);
        $this->beAdmin();
        $csv = $this->getCsv('image-metadata-case-insensitive.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(200);
        $this->assertEquals(-1500, $image->fresh()->metadata['gps_altitude']);
    }

    public function testStoreSynonyms()
    {
        $id = $this->volume()->id;
        $image = ImageTest::create([
            'filename' => 'abc.jpg',
            'volume_id' => $id,
        ]);
        $this->beAdmin();
        $csv = $this->getCsv('image-metadata-synonyms.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(200);
        $this->assertEquals(52.220, $image->fresh()->lng);
        $this->assertEquals(28.123, $image->fresh()->lat);

        $image->lng = null;
        $image->lat = null;
        $image->save();

        $csv = $this->getCsv('image-metadata-synonyms2.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(200);
        $this->assertEquals(52.220, $image->fresh()->lng);
        $this->assertEquals(28.123, $image->fresh()->lat);
    }

    public function testStoreEmptyCells()
    {
        $id = $this->volume()->id;
        $image = ImageTest::create([
            'filename' => 'abc.jpg',
            'volume_id' => $id,
        ]);
        $this->beAdmin();
        $csv = $this->getCsv('image-metadata-emptycells.csv');
        $this->postJson("/api/v1/volumes/{$id}/images/metadata", ['file' => $csv])
            ->assertStatus(200);
        $this->assertEquals(52.220, $image->fresh()->lng);
        $this->assertEquals(28.123, $image->fresh()->lat);
    }
}
